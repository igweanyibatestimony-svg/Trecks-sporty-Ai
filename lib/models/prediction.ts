// Prediction model
export interface Prediction {
    id: string;
    matchId: string;
    prediction: string;
    confidence: number;
    createdAt: Date;
}

export const createPrediction = (data: Omit<Prediction, 'id' | 'createdAt'>): Prediction => {
    return {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
    };
};