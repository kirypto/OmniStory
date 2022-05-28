import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class ImageFetcherService {

    constructor(private _httpClient: HttpClient) {
    }

    public fetchImage(src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                setTimeout(() => resolve(img), 1);
            };
            img.onerror = reject;
            img.src = src;
        });
    }
}
