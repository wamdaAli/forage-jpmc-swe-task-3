import { ServerRespond } from './DataStreamer';

/**
 * processes the raw stock data we receive from the server before the Graph component renders it
 */

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  timestamp: Date,
  upper_bound: number,
  lower_bound: number,
  trigger_alert: number | undefined,
}


export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) / 2;
    const currentRatio = priceABC / priceDEF;

    //define the threshold as +/-10% 
    const threshold = 0.10; // 10%

    //calculate th eupper and lower bounds 
    const upperBound = currentRatio * (1 + threshold);
    const lowerBound = currentRatio * (1 - threshold);

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio: currentRatio,
      timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ?
        serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      trigger_alert: (currentRatio > upperBound || currentRatio < lowerBound) ? currentRatio : undefined,
    };
  }
}

