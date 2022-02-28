import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Visit } from './visit.model';
import { VisitService } from './visit.service';

@Resolver(() => Visit)
export class VisitResolver {
  constructor(private visitService: VisitService) {}

  @ResolveField()
  darts(@Parent() { id }: Visit) {
    return this.visitService.getDarts(id);
  }
}
