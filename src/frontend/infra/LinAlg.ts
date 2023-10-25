export class Vec2 {
  constructor(public x: number = 0, public y: number = 0) { }

  add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  add_(other: Vec2): void {
    this.x += other.x;
    this.y += other.y;
  }

  sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  sub_(other: Vec2): void {
    this.x -= other.x;
    this.y -= other.y;
  }

  mul(scalar: number): Vec2 {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  mul_(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
  }

  dot(other: Vec2): number {
    return this.x * other.x + this.y * other.y;
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vec2 {
    const length = this.length;
    return new Vec2(this.x / length, this.y / length);
  }

  equals(other: Vec2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  distanceCompare(other: Vec2, epsilon: number): boolean {
    const delta = this.sub(other);
    return delta.dot(delta) < epsilon * epsilon;
  }

  public toString(): string {
    return `${this.x},${this.y}`;
  }
}


export class Vec3 {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) { }

  add(other: Vec3): Vec3 {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  sub(other: Vec3): Vec3 {
    return new Vec3(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  mul(scalar: number): Vec3 {
    return new Vec3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  add_(other: Vec3): void {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
  }

  sub_(other: Vec3): void {
    this.x -= other.x;
    this.y -= other.y;
    this.z -= other.z;
  }

  mul_(scalar: number): void {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
  }

  dot(other: Vec3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  cross(other: Vec3): Vec3 {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  }

  cross_(other: Vec3): void {
    const x = this.y * other.z - this.z * other.y;
    const y = this.z * other.x - this.x * other.z;
    const z = this.x * other.y - this.y * other.x;

    this.x = x;
    this.y = y;
    this.z = z;
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): Vec3 {
    const length = this.length;
    return new Vec3(this.x / length, this.y / length, this.z / length);
  }

  equals(other: Vec3): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  distanceCompare(other: Vec3, epsilon: number): boolean {
    const delta = this.sub(other);
    return delta.dot(delta) < epsilon * epsilon;
  }

  public toString(): string {
    return `${this.x},${this.y},${this.z}`;
  }
}


export class Mat2 {
  constructor(public m11: number, public m12: number, public m21: number, public m22: number) { }

  add(other: Mat2): Mat2 {
    return new Mat2(
      this.m11 + other.m11,
      this.m12 + other.m12,
      this.m21 + other.m21,
      this.m22 + other.m22
    );
  }

  sub(other: Mat2): Mat2 {
    return new Mat2(
      this.m11 - other.m11,
      this.m12 - other.m12,
      this.m21 - other.m21,
      this.m22 - other.m22
    );
  }

  mul(other: Mat2): Mat2 {
    const m11 = this.m11 * other.m11 + this.m12 * other.m21;
    const m12 = this.m11 * other.m12 + this.m12 * other.m22;
    const m21 = this.m21 * other.m11 + this.m22 * other.m21;
    const m22 = this.m21 * other.m12 + this.m22 * other.m22;
    return new Mat2(m11, m12, m21, m22);
  }

  mulVec(vec: Vec2): Vec2 {
    const x = this.m11 * vec.x + this.m12 * vec.y;
    const y = this.m21 * vec.x + this.m22 * vec.y;
    return new Vec2(x, y);
  }

  transpose(): Mat2 {
    return new Mat2(this.m11, this.m21, this.m12, this.m22);
  }

  get identity(): Mat2 {
    return new Mat2(1, 0, 0, 1);
  }

  static fromDiagonal(d1: number, d2: number): Mat2 {
    return new Mat2(d1, 0, 0, d2);
  }
}

export class Mat3 {
  constructor(
    public m11: number,
    public m12: number,
    public m13: number,
    public m21: number,
    public m22: number,
    public m23: number,
    public m31: number,
    public m32: number,
    public m33: number
  ) { }

  add(other: Mat3): Mat3 {
    return new Mat3(
      this.m11 + other.m11,
      this.m12 + other.m12,
      this.m13 + other.m13,
      this.m21 + other.m21,
      this.m22 + other.m22,
      this.m23 + other.m23,
      this.m31 + other.m31,
      this.m32 + other.m32,
      this.m33 + other.m33
    );
  }

  sub(other: Mat3): Mat3 {
    return new Mat3(
      this.m11 - other.m11,
      this.m12 - other.m12,
      this.m13 - other.m13,
      this.m21 - other.m21,
      this.m22 - other.m22,
      this.m23 - other.m23,
      this.m31 - other.m31,
      this.m32 - other.m32,
      this.m33 - other.m33
    );
  }

  mul(other: Mat3): Mat3 {
    const m11 = this.m11 * other.m11 + this.m12 * other.m21 + this.m13 * other.m31;
    const m12 = this.m11 * other.m12 + this.m12 * other.m22 + this.m13 * other.m32;
    const m13 = this.m11 * other.m13 + this.m12 * other.m23 + this.m13 * other.m33;
    const m21 = this.m21 * other.m11 + this.m22 * other.m21 + this.m23 * other.m31;
    const m22 = this.m21 * other.m12 + this.m22 * other.m22 + this.m23 * other.m32;
    const m23 = this.m21 * other.m13 + this.m22 * other.m23 + this.m23 * other.m33;
    const m31 = this.m31 * other.m11 + this.m32 * other.m21 + this.m33 * other.m31;
    const m32 = this.m31 * other.m12 + this.m32 * other.m22 + this.m33 * other.m32;
    const m33 = this.m31 * other.m13 + this.m32 * other.m23 + this.m33 * other.m33;
    return new Mat3(m11, m12, m13, m21, m22, m23, m31, m32, m33);
  }

  mulVec(vec: Vec3): Vec3 {
    const x = this.m11 * vec.x + this.m12 * vec.y + this.m13 * vec.z;
    const y = this.m21 * vec.x + this.m22 * vec.y + this.m23 * vec.z;
    const z = this.m31 * vec.x + this.m32 * vec.y + this.m33 * vec.z;
    return new Vec3(x, y, z);
  }

  transpose(): Mat3 {
    return new Mat3(
      this.m11,
      this.m21,
      this.m31,
      this.m12,
      this.m22,
      this.m32,
      this.m13,
      this.m23,
      this.m33
    );
  }

  static identity(): Mat3 {
    return new Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1);
  }

  static fromDiagonal(d1: number, d2: number, d3: number): Mat3 {
    return new Mat3(d1, 0, 0, 0, d2, 0, 0, 0, d3);
  }
}
