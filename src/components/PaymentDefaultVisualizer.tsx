
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AreaChart, Area, LineChart, Line } from 'recharts';

// Mock data based on the reference code and sample data provided
const modelPerformance = [
  { name: 'Logistic Regression', auc: 0.79, accuracy: 0.76, precision: 0.69, recall: 0.65 },
  { name: 'Random Forest', auc: 0.85, accuracy: 0.82, precision: 0.78, recall: 0.73 },
  { name: 'Gradient Boosting', auc: 0.83, accuracy: 0.80, precision: 0.76, recall: 0.72 },
  { name: 'XGBoost', auc: 0.84, accuracy: 0.81, precision: 0.77, recall: 0.71 },
];

const featureImportance = [
  { name: 'max_delay', importance: 0.26 },
  { name: 'avg_delay', importance: 0.18 },
  { name: 'payment_trend', importance: 0.14 },
  { name: 'avg_paid_ratio', importance: 0.11 },
  { name: 'total_delayed', importance: 0.09 },
  { name: 'high_credit_risk', importance: 0.07 },
  { name: 'payment_volatility', importance: 0.06 },
  { name: 'total_on_time', importance: 0.05 },
  { name: 'credit_bins_3', importance: 0.03 },
  { name: 'gender_1', importance: 0.01 },
];

const defaultDistribution = [
  { name: 'Default', value: 20 },
  { name: 'No Default', value: 80 },
];

const paymentStatusDistribution = [
  { status: 'On Time (-1)', count: 62 },
  { status: '1 Month Late (1)', count: 16 },
  { status: '2 Months Late (2)', count: 10 },
  { status: '3+ Months Late (3+)', count: 12 },
];

const rocCurveData = [
  { fpr: 0, tpr: 0 },
  { fpr: 0.05, tpr: 0.38 },
  { fpr: 0.1, tpr: 0.55 },
  { fpr: 0.2, tpr: 0.75 },
  { fpr: 0.4, tpr: 0.88 },
  { fpr: 0.6, tpr: 0.93 },
  { fpr: 0.8, tpr: 0.97 },
  { fpr: 1, tpr: 1 },
];

const thresholdImpact = [
  { threshold: 0.1, precision: 0.42, recall: 0.93, f1: 0.58 },
  { threshold: 0.2, precision: 0.52, recall: 0.87, f1: 0.65 },
  { threshold: 0.3, precision: 0.63, recall: 0.80, f1: 0.70 },
  { threshold: 0.4, precision: 0.70, recall: 0.75, f1: 0.72 },
  { threshold: 0.5, precision: 0.78, recall: 0.67, f1: 0.72 },
  { threshold: 0.6, precision: 0.83, recall: 0.52, f1: 0.64 },
  { threshold: 0.7, precision: 0.88, recall: 0.40, f1: 0.55 },
  { threshold: 0.8, precision: 0.92, recall: 0.28, f1: 0.43 },
  { threshold: 0.9, precision: 0.95, recall: 0.14, f1: 0.24 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const PaymentDefaultVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Payment Default Prediction Analysis</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="model">Model Performance</TabsTrigger>
          <TabsTrigger value="features">Feature Analysis</TabsTrigger>
          <TabsTrigger value="optimization">Threshold Optimization</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Default Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={defaultDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {defaultDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={paymentStatusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4C51BF" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Project Summary</h2>
              <p className="mb-2">
                This visualization presents the results of a payment default prediction model trained on client payment history data. 
                The model achieved an AUC of 0.85, with precision of 0.78 and recall of 0.73 using Random Forest.
              </p>
              <p className="mb-2">
                Our analysis revealed that maximum payment delay and average delay are the strongest predictors of future defaults. 
                Clients with consistent late payments showed significantly higher default risk.
              </p>
              <p>
                The model can be used to identify high-risk clients early, enabling proactive intervention strategies 
                to reduce default rates. A threshold of 0.4 was found to be optimal for balancing precision and recall.
              </p>
            </Card>
          </div>
        </TabsContent>
        
        {/* Model Performance Tab */}
        <TabsContent value="model" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Model Comparison (AUC)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={modelPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0.7, 0.9]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="auc" fill="#4C51BF" name="AUC Score" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">ROC Curve (Random Forest)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={rocCurveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fpr" label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft' }} />
                  <Line type="monotone" dataKey="tpr" stroke="#4C51BF" strokeWidth={2} />
                  <Line type="monotone" dataKey="fpr" stroke="#ddd" strokeWidth={1} strokeDasharray="5 5" />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Card>
            
            <Card className="p-6 md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Final Model Metrics (Random Forest)</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <p className="font-medium text-sm">Accuracy</p>
                  <Progress value={82} className="h-2" />
                  <p className="text-sm text-right">82%</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Precision</p>
                  <Progress value={78} className="h-2" />
                  <p className="text-sm text-right">78%</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">Recall</p>
                  <Progress value={73} className="h-2" />
                  <p className="text-sm text-right">73%</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-sm">F1 Score</p>
                  <Progress value={75} className="h-2" />
                  <p className="text-sm text-right">75%</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
        
        {/* Feature Analysis Tab */}
        <TabsContent value="features" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Top 10 Feature Importance</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={featureImportance}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" />
                <Tooltip />
                <Bar dataKey="importance" fill="#4C51BF" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
        
        {/* Threshold Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Threshold Impact on Model Metrics</h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={thresholdImpact}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="threshold" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="precision" stroke="#0088FE" strokeWidth={2} />
                <Line type="monotone" dataKey="recall" stroke="#00C49F" strokeWidth={2} />
                <Line type="monotone" dataKey="f1" stroke="#FF8042" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6">
              <p className="font-medium">Optimal Threshold: 0.4</p>
              <p className="mt-2 text-sm text-gray-600">
                At this threshold, the model achieves a good balance between precision (70%) and recall (75%), 
                maximizing the F1 score at 72%. This threshold is recommended for production use.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentDefaultVisualizer;
