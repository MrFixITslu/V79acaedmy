/** Limited to ordinary /24–/30 IPv4 broadcast LANs; deliberately excludes /31 and /32. */
export function subnetDetails(ip: string, prefix: number) {
 const parts=ip.trim().split('.');
 if(parts.length!==4 || parts.some(p=>!/^\d{1,3}$/.test(p) || +p>255) || !Number.isInteger(prefix) || prefix<24 || prefix>30) return null;
 const address=parts.reduce((sum,p)=>sum*256+Number(p),0);
 const size=2**(32-prefix);const network=Math.floor(address/size)*size;
 const text=(n:number)=>[24,16,8,0].map(shift=>Math.floor(n/2**shift)%256).join('.');
 return {network:text(network),broadcast:text(network+size-1),first:text(network+1),last:text(network+size-2),mask:`255.255.255.${256-size}`,total:size,usable:size-2};
}
