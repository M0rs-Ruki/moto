import * as amqp from "amqplib";

class RabbitMQService {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  async connect(): Promise<void> {
    try {
      const rabbitmqUrl =
        process.env.RABBITMQ_URL || "amqp://admin:admin123@localhost:5672";
      this.connection = (await amqp.connect(rabbitmqUrl)) as any;
      this.channel = await (this.connection as any).createChannel();

      console.log("Connected to RabbitMQ");

      (this.connection as any).on("error", (err: any) => {
        console.error("RabbitMQ connection error:", err);
        this.reconnect();
      });

      (this.connection as any).on("close", () => {
        console.warn("RabbitMQ connection closed. Reconnecting...");
        this.reconnect();
      });
    } catch (error) {
      console.error("Failed to connect to RabbitMQ:", error);
      setTimeout(() => this.connect(), 5000);
    }
  }

  private reconnect(): void {
    console.log("Attempting to reconnect to RabbitMQ...");
    setTimeout(() => this.connect(), 5000);
  }

  getChannel(): amqp.Channel | null {
    if (!this.channel) {
      throw new Error(
        "RabbitMQ channel is not established. Call connect() first.",
      );
    }
    return this.channel;
  }

  getConnection(): amqp.Connection {
    if (!this.connection) {
      throw new Error(
        "RabbitMQ connection is not established. Call connect() first.",
      );
    }
    return this.connection;
  }

  async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await (this.connection as any).close();
      }
      console.log("Disconnected from RabbitMQ");
    } catch (error) {
      console.error("Error while disconnecting from RabbitMQ:", error);
    }
  }
}

export const rabbitMQService = new RabbitMQService();
