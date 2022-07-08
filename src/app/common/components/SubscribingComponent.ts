import {Subscription} from "rxjs";
import {Component, OnDestroy} from "@angular/core";

@Component({template: ""})
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
