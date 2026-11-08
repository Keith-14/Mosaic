export type Coupon = {code:string;label:string;type:'percent'|'flat'|'freebie';value:number;productId?:string;expiresAt:string;used:boolean}
export const starterCoupons: Coupon[] = []
