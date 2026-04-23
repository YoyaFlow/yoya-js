/**
 * @fileoverview Matrix2D 2D 变换矩阵
 * 提供 2D 仿射变换矩阵运算
 */

class Matrix2D {
  /**
   * @param {number} a - 缩放 X
   * @param {number} b - 倾斜 Y
   * @param {number} c - 倾斜 X
   * @param {number} d - 缩放 Y
   * @param {number} e - 平移 X
   * @param {number} f - 平移 Y
   */
  constructor(a = 1, b = 0, c = 0, d = 1, e = 0, f = 0) {
    this.a = a; // scaleX
    this.b = b; // skewY
    this.c = c; // skewX
    this.d = d; // scaleY
    this.e = e; // translateX
    this.f = f; // translateY
  }

  /**
   * 复制矩阵
   * @returns {Matrix2D} 新的矩阵
   */
  clone() {
    return new Matrix2D(this.a, this.b, this.c, this.d, this.e, this.f);
  }

  /**
   * 乘以另一个矩阵
   * @param {Matrix2D} other - 另一个矩阵
   * @returns {Matrix2D} this
   */
  multiply(other) {
    const a1 = this.a, b1 = this.b, c1 = this.c, d1 = this.d, e1 = this.e, f1 = this.f;
    const a2 = other.a, b2 = other.b, c2 = other.c, d2 = other.d, e2 = other.e, f2 = other.f;

    this.a = a1 * a2 + b1 * c2;
    this.b = a1 * b2 + b1 * d2;
    this.c = c1 * a2 + d1 * c2;
    this.d = c1 * b2 + d1 * d2;
    this.e = e1 * a2 + f1 * c2 + e2;
    this.f = e1 * b2 + f1 * d2 + f2;

    return this;
  }

  /**
   * 平移变换
   * @param {number} x - X 方向平移量
   * @param {number} y - Y 方向平移量
   * @returns {Matrix2D} this
   */
  translate(x, y) {
    this.e += x;
    this.f += y;
    return this;
  }

  /**
   * 缩放变换
   * @param {number} sx - X 方向缩放比例
   * @param {number} sy - Y 方向缩放比例
   * @returns {Matrix2D} this
   */
  scale(sx, sy) {
    this.a *= sx;
    this.b *= sx;
    this.c *= sy;
    this.d *= sy;
    return this;
  }

  /**
   * 旋转变换（弧度）
   * @param {number} radians - 旋转弧度
   * @returns {Matrix2D} this
   */
  rotate(radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    const a1 = this.a, b1 = this.b, c1 = this.c, d1 = this.d;
    this.a = a1 * cos - b1 * sin;
    this.b = a1 * sin + b1 * cos;
    this.c = c1 * cos - d1 * sin;
    this.d = c1 * sin + d1 * cos;

    return this;
  }

  /**
   * 旋转变换（角度）
   * @param {number} degrees - 旋转角度
   * @returns {Matrix2D} this
   */
  rotateDegrees(degrees) {
    return this.rotate((degrees * Math.PI) / 180);
  }

  /**
   * 逆变换
   * @returns {Matrix2D} this
   */
  invert() {
    const det = this.a * this.d - this.b * this.c;
    if (det === 0) {
      // 奇异矩阵，无法求逆
      console.warn('Matrix2D: Cannot invert singular matrix');
      return this;
    }

    const invDet = 1 / det;
    const a = this.d * invDet;
    const b = -this.b * invDet;
    const c = -this.c * invDet;
    const d = this.a * invDet;
    const e = (this.c * this.f - this.d * this.e) * invDet;
    const f = (this.b * this.e - this.a * this.f) * invDet;

    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;

    return this;
  }

  /**
   * 变换点
   * @param {number} x - X 坐标
   * @param {number} y - Y 坐标
   * @returns {{x: number, y: number}} 变换后的坐标
   */
  transformPoint(x, y) {
    return {
      x: x * this.a + y * this.c + this.e,
      y: x * this.b + y * this.d + this.f
    };
  }

  /**
   * 重置为单位矩阵
   * @returns {Matrix2D} this
   */
  identity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    return this;
  }

  /**
   * 从 Canvas Transform 创建矩阵
   * @param {DOMMatrix|Object} transform - Canvas 变换对象
   * @returns {Matrix2D} 新矩阵
   * @static
   */
  static fromTransform(transform) {
    return new Matrix2D(
      transform.a,
      transform.b,
      transform.c,
      transform.d,
      transform.e,
      transform.f
    );
  }

  /**
   * 创建平移矩阵
   * @param {number} x - X 平移量
   * @param {number} y - Y 平移量
   * @returns {Matrix2D} 新矩阵
   * @static
   */
  static translate(x, y) {
    return new Matrix2D(1, 0, 0, 1, x, y);
  }

  /**
   * 创建缩放矩阵
   * @param {number} sx - X 缩放比例
   * @param {number} sy - Y 缩放比例
   * @returns {Matrix2D} 新矩阵
   * @static
   */
  static scale(sx, sy) {
    return new Matrix2D(sx, 0, 0, sy, 0, 0);
  }

  /**
   * 创建旋转矩阵（弧度）
   * @param {number} radians - 旋转弧度
   * @returns {Matrix2D} 新矩阵
   * @static
   */
  static rotate(radians) {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    return new Matrix2D(cos, sin, -sin, cos, 0, 0);
  }

  /**
   * 转换为数组形式
   * @returns {number[]} [a, b, c, d, e, f]
   */
  toArray() {
    return [this.a, this.b, this.c, this.d, this.e, this.f];
  }

  /**
   * 转换为 CSS transform 字符串
   * @returns {string} CSS transform 字符串
   */
  toCSS() {
    return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.e}, ${this.f})`;
  }
}

export { Matrix2D };
