import {Subscription} from "rxjs";
import {OnDestroy} from "@angular/core";

export abstract class SubscribingComponent implements OnDestroy {
    private _subscriptions: Subscription[] = [];

    protected set newSubscription(value: Subscription) {
        this._subscriptions.push(value);
    }

    protected clearSubscriptions(): void {
        this._subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    public ngOnDestroy(): void {
        this.clearSubscriptions();
    }
}
