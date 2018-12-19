function fooGood<T: { x: number }>(obj: T): T
{
   console.log(Math.abs(obj.x));
   return obj;
}
