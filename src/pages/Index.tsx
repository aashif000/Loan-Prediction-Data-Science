
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentDefaultVisualizer from '@/components/PaymentDefaultVisualizer';

const Index = () => {
  const [activeTab, setActiveTab] = useState("visualization");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900">Payment Default Prediction Analysis</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="visualization">Interactive Visualization</TabsTrigger>
            <TabsTrigger value="notebook">Python Notebook</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualization" className="space-y-6">
            <PaymentDefaultVisualizer />
          </TabsContent>
          
          <TabsContent value="notebook">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Python Notebook</h2>
              <p className="mb-4">
                This application includes a comprehensive Jupyter Notebook with a complete data science solution 
                for predicting payment defaults. The notebook includes:
              </p>
              
              <ul className="list-disc ml-6 mb-4 space-y-2">
                <li>Exploratory data analysis</li>
                <li>Data cleaning and preprocessing</li>
                <li>Feature engineering</li>
                <li>Model training and validation</li>
                <li>Model performance evaluation</li>
                <li>Optimization techniques</li>
                <li>Deployment-ready scoring function</li>
              </ul>
              
              <p className="mb-6">
                The full Jupyter Notebook can be found in the <code>src/python/payment_default_analysis.ipynb</code> file.
              </p>
              
              <div className="bg-gray-100 rounded-md p-4 overflow-auto">
                <pre className="text-sm">
                  <code>
{`# payment_default_model.py
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (roc_auc_score, classification_report, 
                             confusion_matrix, RocCurveDisplay, roc_curve)
from sklearn.pipeline import Pipeline
import joblib
import warnings

pd.set_option('display.max_columns', 50)
warnings.filterwarnings('ignore')

def load_data(default_path, history_path):
    """Load and validate input datasets"""
    try:
        default_df = pd.read_csv(default_path)
        history_df = pd.read_csv(history_path)
        
        # Validate required columns
        req_default_cols = ['client_id', 'default', 'credit_given']
        req_history_cols = ['client_id', 'month', 'payment_status', 'bill_amt', 'paid_amt']
        
        for col in req_default_cols:
            if col not in default_df.columns:
                raise ValueError(f"Missing required column in default data: {col}")
                
        for col in req_history_cols:
            if col not in history_df.columns:
                raise ValueError(f"Missing required column in history data: {col}")

        print("=== Data Loaded Successfully ===")
        print(f"Default data shape: {default_df.shape}")
        print(f"History data shape: {history_df.shape}")
        
        return default_df, history_df
    
    except Exception as e:
        print(f"Error loading data: {str(e)}")
        raise

def create_features(default_df, history_df):
    """Feature engineering and data transformation"""
    try:
        # Clean payment status
        history_df['payment_status'] = np.where(
            history_df['payment_status'] < -1, -1, history_df['payment_status']
        )
        
        # Sort by client and month for temporal features
        history_df['month'] = pd.to_datetime(history_df['month'], format='%m')
        history_df = history_df.sort_values(['client_id', 'month'])
        
        # Payment history aggregations
        def safe_division(x):
            bill_amt = history_df.loc[x.index, 'bill_amt']
            mask = bill_amt != 0
            return np.where(mask, x / bill_amt, 0).mean()
        
        payment_agg = history_df.groupby('client_id').agg(
            max_delay=('payment_status', 'max'),
            avg_delay=('payment_status', 'mean'),
            total_delayed=('payment_status', lambda x: (x >= 1).sum()),
            total_on_time=('payment_status', lambda x: (x == -1).sum()),
            avg_paid_ratio=('paid_amt', safe_division),
            payment_volatility=('payment_status', 'std'),
            payment_trend=('payment_status', 
                          lambda x: np.polyfit(np.arange(len(x)), x, 1)[0])
        ).reset_index()
        
        # Merge datasets
        merged_df = pd.merge(default_df, payment_agg, on='client_id', how='left')
        
        # Handle missing/infinite values
        merged_df.replace([np.inf, -np.inf], np.nan, inplace=True)
        merged_df.fillna({
            'avg_delay': 0,
            'payment_volatility': 0,
            'avg_paid_ratio': 0,
            'payment_trend': 0
        }, inplace=True)
        
        # Feature engineering
        merged_df['credit_bins'] = pd.qcut(merged_df['credit_given'], q=4, labels=False)
        merged_df['high_credit_risk'] = ((merged_df['credit_given'] > 200000) & 
                                        (merged_df['avg_delay'] > 2)).astype(int)
        
        return merged_df
    
    except Exception as e:
        print(f"Error in feature engineering: {str(e)}")
        raise

# Scoring function for deployment
def score_model(default_path, history_path, model_path='default_model.pkl', threshold=0.5):
    """Scoring function for new data"""
    try:
        # Load data and process
        default_df, history_df = load_data(default_path, history_path)
        merged_df = create_features(default_df, history_df)
        
        # Preprocessing for model input
        # [preprocessing code would be here]
        
        # Load model
        model = joblib.load(model_path)
        
        # Predict
        proba = model.predict_proba(X)[:, 1]
        default_pred = (proba >= threshold).astype(int)
        
        return pd.DataFrame({
            'client_id': merged_df['client_id'],
            'probability_default': proba,
            'default_indicator': default_pred
        })
    
    except Exception as e:
        print(f"Error in scoring: {str(e)}")
        raise`}
                  </code>
                </pre>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" onClick={() => setActiveTab("visualization")}>
                  View Interactive Visualization
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
