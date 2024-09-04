export interface TrackingEventData {
    date_time: string
    description: string
    status: string
    depot_name: string
}

export interface ResultDataType {
    errors?: {
        code: number
        message: string
        details: string
    }[]
    tracking_events: TrackingEventData[]
}
