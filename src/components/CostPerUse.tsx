import {costPerUse,usage}from'../data/usage'
export function CostPerUse({productId,price,className='' }:{productId:string;price:number;className?:string}){const u=usage[productId];return <p className={`text-xs text-muted ${className}`}>about ₹{costPerUse(productId,price)} per {u?.unitsPerPack===30?'dose':'use'}</p>}
