export interface TrackingEventData {
    date_time: string
    description: string
    status: string
}

export interface ResultDataType {
    tracking_events: TrackingEventData[]
}
