```mermaid
---
title: Trip Planner Application's Entity Relationship Diagram - Stage 3
---
erDiagram

User {
    uuid userId pk
    varchar firstName
    varchar lastName
}

group {
    uuid id pk
    text name
    timestampz created_at
    text description
    text thumbnail_url
    timestampz archived_at
    uuid owner_id FK
    jsonb currencies
}

group_member {
    uuid id pk
    uuid user_id
    uuid group_id
    timestampz added_at
    timestampz assigned_at
    timestampz responded_at
    text nickname
    text status
}

group_invitation {
    timestampz created_at
    timestampz accepted_at
    timestampz rejected_at
    uuid group_id PK, FK
    uuid group_member_id PK, FK
    uuid user_id FK
}

trip {
    uuid id PK
    text name
    text destination
    text type
    timestampz start_date
    timestampz end_date
    text currency_code
    uuid created_by_user_id FK
    text status
    timestampz created_at
    timestampz updated_at
    uuid text_document_id FK
    uuid group_id FK
}

trip_participant {
    uuid id PK
    uuid trip_id FK
    uuid group_member_id FK
    text status
    text nickname
}

trip_feed_item {
    uuid id PK
    uuid trip_id FK
    uuid text_document_id FK
    text type
}

TextDocument

TextDocumentComment

trip_event {
    uuid id PK
    uuid trip_id FK
    text name
    text description
    event_type type
    event_subtype subtype
    timestampz start_datetime
    timestampz end_datetime
    text location
    text external_reference
    text status
    uuid responsible_trip_participant_id FK
}

trip_event_participant {
    uuid trip_event_id PK, FK
    uuid trio_participant PK, FK
    text status
    text notes
}

trip_transaction {
    uuid id PK
    uuid trip_id FK
    uuid group_id FK
    text description
    number amount
    text currency_iso_code
    transaction_status status
    acc_transaction_split_type split_type
    jsonb
}

transaction_status {
    idea
    quoted
    committed
    paid
}

acc_transaction_split_type {
    equal
    shares
    manual
    percentage
}

trip_ledger {
    uuid trip_transaction_id PK, FK
    uuid trip_participant_id PK, FK
    uuid group_member_id FK
    number amount
}

accommodation

accommodation_unit

accommodation_unit_assignment

User ||--o{ group : owns
group ||--o{ group_member: has
group_member }o--o| User : "is assigned"
User ||--o{ group_invitation : receives
trip }o--|| group : "participates in"
trip_participant }o--|| group_member : "takes part in a trip"
trip_participant }o--|| trip : has
trip_feed_item }o--|| trip : has
trip_feed_item ||--o| TextDocument : "consists of"
TextDocument ||--o{ TextDocumentComment : has
trip_event }o--|| trip : "consists of"
trip_event_participant }o--|| trip_event : includes
trip_event_participant }o--|| trip_participant : "participates in"
accommodation }o--|| trip : has
accommodation_unit }o--|| accommodation: "consists of"
accommodation_unit_assignment }o--|| accommodation_unit : "has people staying"
accommodation_unit_assignment }o--|| trip_participant : "stays in"

classDef phase1 fill:#094a1a
classDef phase2 fill:#090c4a
classDef phase3 fill:#4a0921

class trip,trip_participant,trip_feed_item phase1
class trip_event,trip_event_participant phase2
class accommodation,accommodation_unit,accommodation_unit_assignment phase3
```
