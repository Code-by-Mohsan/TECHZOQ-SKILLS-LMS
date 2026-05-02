import mongoose, { ClientSession } from "mongoose";

type TransactionWork<T> = (session: ClientSession) => Promise<T>;

export class HttpRouteError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function runInTransaction<T>(work: TransactionWork<T>): Promise<T> {
  const session = await mongoose.startSession();
  let result: T | undefined;

  try {
    await session.withTransaction(async () => {
      result = await work(session);
    });

    if (result === undefined) {
      throw new Error("Transaction completed without a result");
    }
    return result;
  } finally {
    await session.endSession();
  }
}

