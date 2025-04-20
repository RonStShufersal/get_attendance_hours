import { AttenixDayHours } from '@/types/attenix';
import { Day } from '@/types/hours';
import { getDayFromDayType } from '@/util/types/deconstructors';

export default function getHoursSelectors(day: Day): AttenixDayHours {
    const dayNumber = getDayFromDayType(day);
    return {
        start: {
            hour: `time_start_HH_${dayNumber}`,
            minute: `time_start_MM_${dayNumber}`,
        },
        end: {
            hour: `time_end_HH_${dayNumber}`,
            minute: `time_end_MM_${dayNumber}`,
        },
    };
}