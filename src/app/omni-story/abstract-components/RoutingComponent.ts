import {RoutePaths} from "../route-paths";
import {SubscribingComponent} from "../../common/components/SubscribingComponent";
import {EntityId, WorldId} from "@ttapi/domain/types.model";

export abstract class RoutingComponent extends SubscribingComponent {
    public get RoutePaths(): typeof RoutePaths {
        return RoutePaths;
    }

    public constructPath(path: RoutePaths, replacements: {
        worldId?: WorldId,
        entityId?: EntityId,
    }): string {
        let resultPath = path as string;
        if (replacements.worldId) {
            resultPath = resultPath.replace(":worldId", replacements.worldId);
        }
        if (replacements.entityId) {
            resultPath = resultPath.replace(":entityId", replacements.entityId);
        }
        return resultPath;
    }
}
