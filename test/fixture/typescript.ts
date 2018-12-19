function fooGood<T extends { x: number }>(obj: T): T
{
   console.log(Math.abs(obj.x));
   return obj;
}
