const Docker = require('dockerode');

process.env.DATABASE_HOST = '127.0.0.1';
process.env.DATABASE_PORT = '9555';
process.env.DATABASE_USERNAME = 'test';
process.env.DATABASE_PASSWORD = 'test';
process.env.DATABASE_NAME = 'test';

let docker;

try {
  docker = new Docker({ socketPath: '/var/run/docker.sock' });
} catch (e) {
  console.log('Docker not available, please start it to continue');
  process.exit(0);
}

const containerExec = async (containerName, cmd) => {
  return new Promise((resolve, reject) => {
    docker.getContainer(containerName).exec({ Cmd: cmd, AttachStdout: true, AttachStderr: true }, (err, exec) => {
      if (err) return;
      exec.start((err, stream) => {
        if (err) {
          return reject(err);
        }

        const chunks = [];
        docker.modem.demuxStream(stream, process.stdout, process.stderr);

        exec.inspect((err) => {
          if (err) {
            return reject(err);
          }
        });

        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      });
    });
  });
};

const waitDbReady = async (containerName) => {
  let dbReady = false;
  while (!dbReady) {
    try {
      const result = await containerExec(containerName, ['pg_isready', '-U', 'test']);
      const sanitizedResult = result.split(' ').slice(-2).join(' ').replace(/(\r\n|\n|\r)/gm, "");

      if(sanitizedResult === 'accepting connections') {
        dbReady = true;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      console.log('Waiting for db to be ready', e);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

const createTestDb = async () => {
  await containerExec(
    CONTAINER_NAME,
    ['createdb', '-U', 'test', 'test']
  );
};

const deleteTestDb = async () => {
  await containerExec(
    CONTAINER_NAME,
    ['dropdb', '-U', 'test', 'test', '--if-exists']
  );
};

const dockerInit = async () => {
  try {
    const CONTAINER_PORT = process.env.DATABASE_PORT;
    const CONTAINER_NAME = 'test_resusable_db';
    let containerInfo;

    const createContainer = () =>
      docker.createContainer({
        Image: 'postgres:10',
        Env: [
          `POSTGRES_PASSWORD=${process.env.DATABASE_USERNAME}`,
          `POSTGRES_USER=${process.env.DATABASE_PASSWORD}`,
          `POSTGRES_DB=${process.env.DATABASE_NAME}`,
        ],
        HostConfig: {
          PortBindings: {
            '5432/tcp': [{ HostPort: CONTAINER_PORT }]
          }
        },
        ExposedPorts: {
          '5432/tcp': {}
        },
        name: CONTAINER_NAME
      });

    const container = await docker.listContainers({ filters: { name: [CONTAINER_NAME] } });

    if (container.length === 0) {
      console.log('Creating DB container ...');
      const container = await createContainer();
      console.log('DB container created');
      await container.start();
      console.log('DB container started');
      await container.inspect();
    }

    containerStatus = async () => {
      const info = await docker.getContainer(CONTAINER_NAME).inspect();
      return info.State.Status;
    };

    while ((await containerStatus()) !== 'running') {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    await waitDbReady(CONTAINER_NAME);
  } catch (e) {
    console.error('setup error', e);
    process.exit(0);
  }
};

dockerInit()