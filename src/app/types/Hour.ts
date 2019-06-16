export interface ClockedHour {
    day: number;
    startHour: number;
    lunchDuration: number;
    // status: number; // 1 - clock in; 2 - enter lunch; 3 - return lunch; 4 - clock out
    isActive: boolean;
    timeWorked?: number; // time worked in minutes
    endHour?: number;
    lunchStart?: number;
    lunchEnd?: number;
}