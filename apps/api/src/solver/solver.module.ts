import { Module } from '@nestjs/common';
import { SolverService } from './solver.service';

@Module({
  providers: [SolverService],
  exports: [SolverService],
})
export class SolverModule {}
