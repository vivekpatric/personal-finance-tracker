import React from 'react'
import { Line, Pie } from '@ant-design/charts';

function ChartComponent({sortedTransactions}) {

    const data=sortedTransactions.map((item)=>{
        return {date:item.date,amount:item.amount};
    });

    const spendingData=sortedTransactions.filter((transaction)=>{
        if(transaction.type=="expense"){
            return {tag:transaction.tag,amount:transaction.amount};
        }
    });

    let finalSpendings=spendingData.reduce((acc,obj)=>{
        let key=obj.tag;
        if(!acc[key]){
            acc[key]={tag:obj.tag,amount:obj.amount};
        }else{
            acc[key].amount +=obj.amount;
        }
        return acc;
    },{});
      const config = {
        data:data,
        width: 800,
        height: 400,
        autoFit: false,
        xField: 'date',
        yField: 'amount',
        point: {
          size: 5,
          shape: 'diamond',
        },
        label: {
          style: {
            fill: '#aaa',
          },
        },
    };
    
    const spendingConfig={
        data:Object.values(finalSpendings),
        width: 800,
        height: 400,
        angleField:"amount",
        colorField:"tag",

    };

    let chart;
    let pieChart;
  return (
    <div className="charts-wrapper">
        <div className='chart-component line-chart'>
            <h2 style={{textAlign:'center'}}>Your Analytics</h2>
            <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
        </div>

        <div className='chart-component pie-chart'>
            <h2 style={{textAlign:'center'}}>Your Spendings</h2>
            <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} />
            
        </div>
        
    </div>
  )
}

export default ChartComponent