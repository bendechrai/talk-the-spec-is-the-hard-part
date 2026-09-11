export interface SeedRoom {
  id: string;
  name: string;
  capacity: number;
  wing?: string;
}

export interface SeedSlot {
  id: string;
  day: string;
  start: string;
  end: string;
  kind: "session" | "break";
  label?: string;
}

export interface SeedSpeaker {
  id: string;
  name: string;
}

export interface SeedTalk {
  id: string;
  title: string;
  speakers: string[];
  lengthMinutes: number;
  track: string;
  expectedAudience: number;
}

export interface SeedData {
  conference: {
    name: string;
    days: string[];
    dayStart: string;
    dayEnd: string;
  };
  rooms: SeedRoom[];
  slots: SeedSlot[];
  speakers: SeedSpeaker[];
  talks: SeedTalk[];
}
