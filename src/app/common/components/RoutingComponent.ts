import {RoutePaths} from "../types/route-paths";

export abstract class RoutingComponent {
   public get RoutePaths(): typeof RoutePaths {
      return RoutePaths;
   }
}
