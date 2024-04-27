import { TradeType } from "./TradeType";


export default class ListingId {
    // stores a string uid, a quality number, and offer/request type
    private uid: string;
    private quality: number;
    private tradeType: TradeType;

    constructor(uid: string, quality: number, tradeType: TradeType) {
        this.uid = uid;
        this.quality = quality;
        this.tradeType = tradeType;
    }

    public getUid(): string {
        return this.uid;
    }

    public getQuality(): number {
        return this.quality;
    }

    public getTradeType(): TradeType {
        return this.tradeType;
    }

}