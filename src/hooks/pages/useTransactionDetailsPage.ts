import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {setTransactionDetailSessionId} from "../../redux/transaction.slice.ts";
import {useTransactionQuery} from "../../queries/transaction.query.ts";

export const useTransactionDetailsPage = () => {
  const dispatch = useDispatch();
  const { transactionDetails, loadingTransactionDetails } = useTransactionQuery();
  
  const { id } = useParams({ from: '/dashboard/transactions/$id' })
  
  useEffect(() => {
    if (id) {
      dispatch(setTransactionDetailSessionId(id))
    }
  }, [id, dispatch]);
  
  
  return {
    // 🧩 Values
    transactionDetails,
    loadingTransactionDetails,
    
    // ⚙️ Functions
  }
}