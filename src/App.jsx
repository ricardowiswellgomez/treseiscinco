    if (!activeBusiness?.id || screen !== "profitability") return;
    setProfitabilityLoading(true); setError("");
    try {
      const [sales, expenses, purchasePayments] = await Promise.all([
        fetchAllProfitabilityRows(
          () => supabase.from("sales").select("id,business_id,status,currency_code,subtotal_minor,discount_minor,tax_minor,total_minor,amount_paid_minor,sold_at,created_at")
            .eq("business_id", activeBusiness.id).order("sold_at", { ascending: false }).order("id", { ascending: true }),
          "ventas"
        ),
        fetchAllProfitabilityRows(
          () => supabase.from("expenses").select("id,business_id,category,description,amount_minor,currency_code,expense_date")
            .eq("business_id", activeBusiness.id).order("expense_date", { ascending: false }).order("id", { ascending: true }),
          "gastos"
        ),
        canAccessScreen("purchases") ? fetchAllProfitabilityRows(
          () => supabase.from("purchase_payments").select("id,business_id,purchase_id,amount_minor,payment_method,paid_at")
            .eq("business_id", activeBusiness.id).order("paid_at", { ascending: false }).order("id", { ascending: true }),
          "pagos de compras"
        ) : Promise.resolve([])
      ]);
      let items = [];
      if (sales.length) {
        const batchSize = 100;
        for (let index = 0; index < sales.length; index += batchSize) {
          const ids = sales.slice(index, index + batchSize).map((sale) => sale.id);
          const rows = await fetchAllProfitabilityRows(
            () => supabase.from("sale_items")
              .select("id,sale_id,product_id,item_name,quantity,unit_cost_minor,discount_minor,tax_minor,line_total_minor")
              .eq("business_id", activeBusiness.id).in("sale_id", ids).order("created_at").order("id", { ascending: true }),
            "líneas de venta"
          );
          items.push(...rows);
        }
      }
      setProfitabilitySales(sales);
      setProfitabilitySaleItems(items);
      setProfitabilityExpenses(expenses);
      setProfitabilityPurchasePayments(purchasePayments);
    } catch (e) {