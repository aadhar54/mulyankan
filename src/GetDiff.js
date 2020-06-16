import { transform, isEqual, isObject, isArray, mergeWith } from 'lodash/fp';

export class GetDiff {
  constructor(obj1, obj2, action) {
    this.obj1 = obj1;
    this.obj2 = obj2;

    if (action === 'diff') {
      return this.difference(this.obj1, this.obj2);
    } else if (action === 'merge') {
      return this.merge(this.obj1, this.obj2);
    }
  }

  _transform = transform.convert({
    cap: false,
  });

  iterate = (baseObj) => (result, value, key) => {
    if (!isEqual(value, baseObj[key])) {
      const valIsObj = isObject(value) && isObject(baseObj[key]);
      result[key] =
        valIsObj === true ? this.difference(value, baseObj[key]) : value;
    }
  };

  difference(targetObj, baseObj) {
    return this._transform(this.iterate(baseObj), null, targetObj);
  }

  merge(obj1, obj2) {
    const customizer = (objValue, srcValue) => {
      if (isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    };
    mergeWith(obj1, obj2, customizer);
  }
}
