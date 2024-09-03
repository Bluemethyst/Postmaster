export interface TrackingEventData {
    date_time: string
    description: string
    status: string
    depot_name: string
}

export interface ResultDataType {
    errors?: string[]
    tracking_events: TrackingEventData[]
}
