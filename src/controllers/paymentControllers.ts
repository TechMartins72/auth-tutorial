import type { Request, Response } from "express";

export const initializeTransaction = async (req: Request, res: Response) => {
  const params = req.body;

  if (!params) {
    return res.status(400).json({ error: "No params provided" });
  }

  const url = process.env.PAYSTACK_PAYMENT_API;

  if (!url) {
    return;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Paystack Init Response:", data);
    res.status(200).json(data);
  } catch (error) {
    const errorMessage =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : String(error);

    res.status(500).json({
      error: "Failed to create product",
      details: errorMessage,
    });
    console.error("❌ Paystack Init Error:", errorMessage);
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { reference } = req.params;

  try {
    const response = await fetch(
      `${process.env.PAYSTACK_VERIFICATION_API}/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();

    if (data.status === "success") {
      // payment confirmed
      return res.json({ status: "success", data });
    } else {
      return res.json({ status: "failed", data: data });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Verification failed" });
  }
};
