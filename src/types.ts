export interface TrackingEventData {
    date_time: string
    description: string
    status: string
    depot_name: string
}

export interface ResultDataType {
    tracking_events: TrackingEventData[]
}
