import React, { useState } from 'react'
import { Select, Table,Radio } from 'antd';
import Search from "../../assets/Search.svg"
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';


function TransactionsTable({transactions,addTransaction}) {
    const {Option} =Select;
    const [search,setSearch]=useState("");
    const [typeFilter,setTypeFilter]=useState("");
    const [sortKey,setSortKey]=useState("");
    const [sortDirection,setSortDirection]=useState("");
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Tag',
          dataIndex: 'tag',
          key: 'tag',
        },
        {
          title: 'Type',
          dataIndex: 'type',
          key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
          },

            
      ];
      
    // let filteredTransactions = transactions.filter(
    //     (item)=>
    //  item.name.toLowerCase().includes(search.toLowerCase())&&
    //   item.type.includes(typeFilter)
    // );

    let filteredTransactions = transactions.filter((item) => {
      // Check if item.type is defined and not null before using includes
      if (item.type && typeof item.type === 'string') {
        return (
          item.name.toLowerCase().includes(search.toLowerCase()) &&
          item.type.includes(typeFilter)
        );
      }
      // If item.type is undefined or not a string, exclude it from the filtered result
      return false;
    });


    let sortedTransactions=filteredTransactions.sort((a,b)=>{
      if (sortKey === "date") {
        // Use Date.parse to convert date strings to timestamps for comparison
        if(sortDirection==="asc"){
          const dateA = Date.parse(a.date);
          const dateB = Date.parse(b.date);
          return dateA - dateB;
        }else if(sortDirection==="desc"){
          const dateA = Date.parse(a.date);
          const dateB = Date.parse(b.date);
          return dateB - dateA;
        }
       
      } else if (sortKey === "amount") {

        if(sortDirection==="asc"){
          return a.amount - b.amount;
        }else if(sortDirection==="desc"){
          return b.amount - a.amount;
        }
        
      } else {
        return 0;
      }
    });

    const toggleSortDirection=() =>{
      setSortDirection(sortDirection==="asc"? "desc":"asc");
    };
    function exportCSV(){
      var csv = unparse({
        fields: ["name","type","tag","date","amount"],
        data: transactions,
      });
      const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      link.href=url;
      link.download="transactions.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); 

    }
    function importFromCsv(event){
      event.preventDefault();
      try{
        parse(event.target.files[0],{
          header:true,
          complete:async function (results) {
            for(const transaction of results.data){
              console.log("Transactions",transaction);
              const newTransaction={
                ...transaction,
                amount:parseFloat(transaction.amount),

              };
              await addTransaction(newTransaction,true);
            }
          },
        });
        toast.success("All Transactions Added");
        //fetchTransactions();
        event.target.files=null;
      }catch(e){
        toast.error(e.message);
      }
    }


    return (
    <div
     style={{
        width:"auto",
        padding:"0rem 2rem",
     }}
    >
        <div
         style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
           marginBottom:"1rem",
         }}
        >
        <div className='input-flex'>
            <img src={Search} width="16" />
            <input
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder='Search By Name' 
            />
        </div>
        

        <Select
          className='select-input'
          onChange={(value)=>setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
            <Option value=""> All</Option>
            <Option value="income">Income</Option>
            <Option value="expense">Expense</Option>    
        </Select>  
     </div>

     <div className='my-table'>
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width:"100%",
           marginBottom:"1rem",
        }}
        >
          <h2 className='table-h2'>My Transactions</h2>
          <Radio.Group
            className='input-radio'
            onChange={(e)=>{
              setSortKey(e.target.value);
              toggleSortDirection();
            }}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>

          <Radio.Group
            className='input-radio'
            onChange={(e)=>toggleSortDirection()}
            value={sortDirection === "asc" ? "asc":"desc"}
          >
            <Radio.Button value="asc">Ascending</Radio.Button>
            <Radio.Button value="desc">Descending</Radio.Button>
            
          </Radio.Group>
          <div className='csv-div'
         style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            width:"400px",
         }}
        >
            <button className='btn exp-btn-csv' onClick={exportCSV}>
                Export to CSV
            </button>
            <label for="file-csv" className='btn btn-blue imp-btn-csv'>
                Import from CSV
            </label>
            <input
                onChange={importFromCsv}
                id="file-csv"
                type='file'
                accept='.csv'
                required
               // onClick={importFromCsv}
                style={{display:"none"}}

            />
        </div>

        </div>

        <Table dataSource={sortedTransactions} columns={columns} />;
     </div>
        
        
    
    </div>
    );
}

export default TransactionsTable;