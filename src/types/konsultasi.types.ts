export interface KonsultasiData {
  id: number;
  content_type: string;
  content: string;
}

export interface KonsultasiUpdateRequest {
  content_type: string;
  content: string;
}