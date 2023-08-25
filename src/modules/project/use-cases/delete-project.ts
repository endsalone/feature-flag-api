import { Injectable } from '@nestjs/common';
import { UserOption } from 'common/user-type';
import { ProjectService } from 'modules/project/domain/project.service';

@Injectable()
export class DeleteProject {
  constructor(private accountService: ProjectService) {}

  async execute(slslug: string, options?: UserOption): Promise<void> {
    await this.accountService.delete(slslug, options.id);
  }
}
