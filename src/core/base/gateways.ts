export abstract class Gateways {
  /**
   * Driver gateway
   * @static
   * @memberof Gateways
   * @example update-location
   * @example driver
   */
  static Driver = class {
    /** driver */
    static Namespace = 'driver';
    /** update-location */
    static UpdateLocation = 'update-location';
    /** driver-offer */
    static DriverOffer = 'driver-offer';
  }

  /**
   * Order gateway
   * @static
   * @memberof Gateways
   * @example order
   * @example order-offer
   */
  static reservation = class {
 
    static Namespace = 'reservation';
   
    static reservationOffer = 'reservation-offer';
   
  }
}
