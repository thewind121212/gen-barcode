import express from "express";
import { getItemNames, getItemDetail, updateItem } from '../../3rd/items'
import { ItemDetail } from '../../3rd/types/item.types'

const router = express.Router();


router.get<object, any>("/getFulItemsDetail", async (req, res) => {
  try {
    const products = await getItemNames()

    // Fetch all item details concurrently, handling errors gracefully
    const itemDetailsPromises = products.map(itemId => getItemDetail(itemId))
    const results = await Promise.allSettled(itemDetailsPromises)

    // Only include successfully fetched items
    const itemsDetailList: ItemDetail[] = results
      .filter((result): result is PromiseFulfilledResult<ItemDetail> => result.status === 'fulfilled')
      .map(result => result.value)

    return res.json(itemsDetailList)
  } catch (error) {
    return res.status(400).json({ error: "Bad Request" });
  }
});

router.get<object, any>("/getFulItemDetail", async (req, res) => {
  try {
    const { itemId } = req.query

    // Validate itemId parameter
    if (!itemId || typeof itemId !== 'string') {
      return res.status(400).json({ error: "itemId query parameter is required" })
    }

    // Fetch the item detail
    const itemDetail = await getItemDetail(itemId)
    return res.json(itemDetail)
  } catch (error) {
    return res.status(400).json({ error: "Bad Request" });
  }
});

router.put("/updateBarcode", async (req, res) => {
  try {
    const { itemId, barcode } = req.body;

    if (!itemId || !barcode) {
      return res.status(400).json({ error: "itemId and barcode are required" });
    }

    // check the bar coude must be EAN mean it all nnumber and 13 lenth

    if (!/^\d{13}$/.test(barcode)) {
      return res.status(400).json({ error: "Barcode must be a valid EAN-13 (13 digits)" });
    }

    await getItemDetail(itemId)

    const updatedItem = await updateItem(itemId, {
      barcodes: [
        {
          barcode: barcode,
          barcode_type: "EAN",
        }
      ]
    });

    return res.json(updatedItem);
  } catch (error) {
    console.error("Error updating barcode:", error);
    return res.status(400).json({ error: "Failed to update barcode" });
  }
});

export default router;
