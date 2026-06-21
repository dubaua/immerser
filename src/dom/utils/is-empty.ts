export default function isEmpty(obj?: Record<string, any> | null): boolean {
  if (!obj) {
    return true;
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
