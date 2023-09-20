import React, { useCallback, useState } from 'react'
import { useEffect } from 'react';
import Header from "../components/Header"
import AddExpenseModal from '../components/Modals/AddExpense';
import AddIncomeModal from '../components/Modals/AddIncome';
import Cards from "../components/Cards"
import TransactionsTable from '../components/TransactionsTable';
import moment from "moment";
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import ChartComponent from '../components/Charts';
import NoTransactions from '../components/NoTransactions';
function Dashboard() {

  const [transactions,setTransactions]=useState([]);
  const [loading,setLoading]=useState(false);

  const [user]=useAuthState(auth);
  const [isExpenseModalVisible,setIsExpenseModalVisible]=useState(false);
  const [isIncomeModalVisible,setIsIncomeModalVisible]=useState(false);
  const [income,setIncome] =useState(0);
  const [expense,setExpense] =useState(0);
  const [totalBalance,setTotalBalance] =useState(0);

  const showExpenseModal= ()=>{
    setIsExpenseModalVisible(true);
  }
  const showIncomeModal= ()=>{
    setIsIncomeModalVisible(true);
  }
  const handleExpenseCancel= ()=>{
    setIsExpenseModalVisible(false);
  }
  const handleIncomeCancel= ()=>{
    setIsIncomeModalVisible(false);
  }

  const onFinish= (values,type)=>{
    const newTransaction={
      type:type,
      date:values.date.format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
    };
    addTransaction(newTransaction);

  };
  async function addTransaction(transaction){
    try{
      const docRef=await addDoc(
        collection(db,`users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID:",docRef.id);
      toast.success("Transactions Added!");
      let newArr =transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    }catch(e){
      console.log("Error adding documents: ",e);
      
       toast.error("Couldn't add Transaction!")
      

    }
  }
  // useEffect( ()=> {
  //   fetchTransactions();
    
  // } ,[user]);

  useEffect(() => {
    calculateBalance();
  });

  const calculateBalance=()=>{
    let incomeTotal=0;
    let expensesTotal=0;
    console.log(transactions)
    transactions.forEach((transaction)=>{
      if (transaction.type === "income") {
        incomeTotal += Number.isNaN(transaction.amount) ? 0 : transaction.amount;
      } else if (transaction.type === "expense") {
        expensesTotal += Number.isNaN(transaction.amount) ? 0 : transaction.amount;
      }
    });

    console.log(incomeTotal);
    console.log(expensesTotal);
    setIncome(incomeTotal);
    setExpense(expensesTotal);

    setTotalBalance(incomeTotal-expensesTotal);
  };


  // async function fetchTransactions(){
  //   setLoading(true);
  //   if(user){
  //     const q=query(collection(db,`users/${user.uid}/transactions`));
  //     const querySnapshot=await getDocs(q);
  //     let transactionsArray=[];
  //     querySnapshot.forEach((doc) => {
  //       transactionsArray.push(doc.data());
  //     });
  //     setTransactions(transactionsArray);
  //     console.log("Transactions Array",transactionsArray);
  //     toast.success("Transactions Fetched!");
  //   }
  //   setLoading(false);
  // }

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    if(user){
      const q=query(collection(db,`users/${user.uid}/transactions`));
      const querySnapshot=await getDocs(q);
      let transactionsArray=[];
      querySnapshot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      console.log("Transactions Array",transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
}, [user]); // include all dependencies used inside this function

useEffect(() => {
  if (user) {
      fetchTransactions();
  }
}, [user, fetchTransactions]);

let sortedTransactions=transactions.sort((a,b)=>{
  return new Date(a.date)-new Date(b.date);
})
  return (
    <div>
      <Header />
     {loading?(
      <p>Loading..</p> ):(
      <>

      <Cards 
       income={income}
       expense={expense}
       totalBalance={totalBalance}
       showExpenseModal={showExpenseModal}
       showIncomeModal={showIncomeModal}
      />

      {transactions.length!=0 ?<ChartComponent sortedTransactions={sortedTransactions}/>:<NoTransactions/>}  
      <AddExpenseModal 
      
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
        footer={null}
        />
      <AddIncomeModal 
       
        isIncomeModalVisible={isIncomeModalVisible}
        
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
        />
        <TransactionsTable
         transactions={transactions}
          addTransaction={addTransaction}
          fetchTransactions={fetchTransactions} 
          />
        
        
        </>)}
    </div>
  )
}

export default Dashboard;