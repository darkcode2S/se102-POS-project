import connectMongoDB from "@/lib/mongodb";
import Product from "@/models/products";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { productId, productName, category, stockLevel, price, location } =
      await req.json();

    await connectMongoDB();

    const newProduct = await Product.create({
      productId,
      productName,
      category,
      stockLevel,
      price,
      location,
    });

    // Return success response
    return NextResponse.json(
      { message: "Product created", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

//display
export async function GET() {
  try {
    await connectMongoDB();
    const getProduct = await Product.find();
    return NextResponse.json({ getProduct }, { status: 201 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

//delete
export async function DELETE(request) {
  // Get the ID from the URL search parameters
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  try {
    await connectMongoDB();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting Product:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}