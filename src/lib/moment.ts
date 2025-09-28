import moment from "moment";
import type {DurationInputArg2} from "moment/moment";

class MomentClient {
  private static instance: MomentClient;

  private constructor() {}

  static getInstance(): MomentClient {
    if (!MomentClient.instance) {
      MomentClient.instance = new MomentClient();
    }
    return MomentClient.instance;
  }

  /**
   * Formats a Date object to a normalised date and time string
   * @param: date - The Date object to format
   * @return: string - The formatted date and time string in "MMMM Do YYYY, h:mm:ss a" format
   * @example: "October 5th 2023, 2:48:00 pm"
   */
  formatToNormalisedDateAndTime(date: Date): string {
    return moment(date).format("MMMM Do YYYY, h:mm:ss A");
  }

  /**
   * Formats a Date object to a transaction initiation date string
   * @param: date - The Date object to format
   * @return: string - The formatted date string in "DD-MM-YYYY, h:mm A" format
   * @example: "05-10-2023, 2:48 PM"
   */
  formatToTransactionInitiationDate(date: Date): string {
    return moment(date).format("DD-MM-YYYY, h:mm A");
  }

  /**
   * Converts a Date object to an ISO 8601 string
   * @param value - The Date object to convert
   * @return string - The ISO 8601 string representation of the date
   * @example: "2023-10-05T14:48:00.000Z"
   */
  toISOStringFromDate(value: Date): string {
    return moment(value).toISOString();
  }

  /**
   * Adds a specified amount of time to the current date and returns the new date
   * @param amount - The amount of time to add (e.g., 5)
   * @param unit - The unit of time to add (e.g., 'days', 'hours', 'minutes')
   * @return Date - The new date after adding the specified time
   * @example: addTimeToCurrentDate(5, 'days') returns a Date object 5 days from now
   */
  addTimeToCurrentDate(amount: number, unit: DurationInputArg2 ): Date {
    return moment().add(amount, unit).toDate();
  }

  /**
   * Checks if a given date is in the future
   * @param lockedUntil - The date to check
   * @return boolean - True if the date is in the future, false otherwise
   * @example: isFutureDate(new Date('2023-12-31')) returns true if the current date is before December 31, 2023
   */
  isFutureDate(lockedUntil: Date) {
    return moment(lockedUntil).isAfter(moment());
  }

  /**
   * Checks if a given date is after the current time minus a specified duration
   * @param date - The date to check
   * @param amount - The amount of time units to subtract from the current time
   * @param unit - The time unit (minutes, hours, days, etc.)
   * @returns True if the date is after the current time minus the specified duration, false otherwise
   */
  isAfterDuration(date: Date, amount: number, unit: DurationInputArg2) {
    return moment(date).isAfter(moment().subtract(amount), unit);
  }

  /**
   * Checks if a given date is within the specified duration from now
   * @param date - The date to check
   * @param number - The number of time units
   * @param unit - The time unit (minutes, hours, days, etc.)
   * @returns True if the date is within the specified duration from now, false otherwise
   */
  isWithinDuration(date: Date, number: number, unit: DurationInputArg2): boolean {
    const cutoffTime = moment().subtract(number, unit);
    return moment(date).isAfter(cutoffTime);
  }

  /**
   * Checks if the current date and time is before the specified date
   * @param date - The date to compare with the current date and time
   * @returns True if the current date and time is before the specified date, false otherwise
   */
  isInFuture(date: Date): boolean {
    return moment().isBefore(moment(date));
  }
}

const momentClient = MomentClient.getInstance();
export default momentClient;
