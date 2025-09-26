'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  X,
  Cloud,
  Mail,
  FileSpreadsheet,
  Share2,
  History,
  Clock,
  Settings,
  Download,
  Upload,
  Zap,
  Users,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Filter,
  Link,
  QrCode,
  Globe,
  Smartphone,
  Shield,
  Sync,
  Database,
  FileText,
  Archive,
  Bell,
  Trash2,
  Copy,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Star,
  Bookmark,
  MessageSquare,
  Target,
  TrendingUp,
  DollarSign,
  PieChart
} from 'lucide-react';
import { formatDate } from '@/utils/date';

interface CloudExportHubProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

type CloudTab = 'integrations' | 'templates' | 'share' | 'history' | 'schedule' | 'analytics';

interface CloudIntegration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  status: 'active' | 'syncing' | 'error' | 'pending';
  description: string;
  features: string[];
  color: string;
  lastSync?: string;
}

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'business' | 'personal' | 'tax' | 'analytics';
  fields: string[];
  format: 'csv' | 'json' | 'pdf' | 'xlsx';
  popular: boolean;
}

interface ExportHistory {
  id: string;
  timestamp: string;
  template: string;
  destination: string;
  status: 'completed' | 'processing' | 'failed' | 'scheduled';
  records: number;
  size: string;
  sharedWith?: string[];
}

const CLOUD_INTEGRATIONS: CloudIntegration[] = [
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    icon: '📊',
    connected: true,
    status: 'active',
    description: 'Export directly to Google Sheets with real-time sync',
    features: ['Real-time sync', 'Collaborative editing', 'Charts & formulas'],
    color: 'bg-green-500',
    lastSync: '2 minutes ago'
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    icon: '📁',
    connected: true,
    status: 'syncing',
    description: 'Automatic file backup and sharing',
    features: ['Auto backup', 'File versioning', 'Team folders'],
    color: 'bg-blue-500',
    lastSync: 'Syncing now...'
  },
  {
    id: 'onedrive',
    name: 'OneDrive',
    icon: '☁️',
    connected: false,
    status: 'pending',
    description: 'Microsoft cloud storage integration',
    features: ['Office integration', '5GB free storage', 'Cross-platform sync'],
    color: 'bg-blue-600'
  },
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '✉️',
    connected: true,
    status: 'active',
    description: 'Send reports directly via email',
    features: ['Scheduled reports', 'Multiple recipients', 'Rich formatting'],
    color: 'bg-red-500',
    lastSync: '5 minutes ago'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: '💬',
    connected: false,
    status: 'pending',
    description: 'Share reports in Slack channels',
    features: ['Channel posting', 'Thread discussions', 'Bot notifications'],
    color: 'bg-purple-500'
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: '📝',
    connected: true,
    status: 'error',
    description: 'Export to Notion databases',
    features: ['Database sync', 'Rich formatting', 'Template support'],
    color: 'bg-gray-800',
    lastSync: 'Error 12 min ago'
  }
];

const EXPORT_TEMPLATES: ExportTemplate[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'Formatted for tax filing and deductions',
    icon: <FileText className="w-6 h-6" />,
    category: 'tax',
    fields: ['Date', 'Amount', 'Category', 'Tax Category', 'Deductible'],
    format: 'pdf',
    popular: true
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'Executive summary with charts and insights',
    icon: <PieChart className="w-6 h-6" />,
    category: 'business',
    fields: ['Month', 'Total', 'Top Categories', 'Trends'],
    format: 'pdf',
    popular: true
  },
  {
    id: 'expense-details',
    name: 'Detailed Expenses',
    description: 'Complete expense breakdown with all fields',
    icon: <Database className="w-6 h-6" />,
    category: 'business',
    fields: ['Date', 'Description', 'Category', 'Amount', 'Notes'],
    format: 'csv',
    popular: false
  },
  {
    id: 'budget-tracker',
    name: 'Budget Tracker',
    description: 'Budget vs actual spending analysis',
    icon: <Target className="w-6 h-6" />,
    category: 'personal',
    fields: ['Category', 'Budget', 'Actual', 'Variance', 'Percentage'],
    format: 'xlsx',
    popular: true
  },
  {
    id: 'analytics-deep',
    name: 'Deep Analytics',
    description: 'Advanced metrics and trend analysis',
    icon: <TrendingUp className="w-6 h-6" />,
    category: 'analytics',
    fields: ['Trends', 'Patterns', 'Predictions', 'Recommendations'],
    format: 'json',
    popular: false
  }
];

const SAMPLE_HISTORY: ExportHistory[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    template: 'Monthly Summary',
    destination: 'Gmail → team@company.com',
    status: 'completed',
    records: 156,
    size: '2.4 MB',
    sharedWith: ['john@company.com', 'sarah@company.com']
  },
  {
    id: '2',
    timestamp: '2024-01-14T15:45:00Z',
    template: 'Tax Report',
    destination: 'Dropbox → /Tax Documents/',
    status: 'completed',
    records: 89,
    size: '1.8 MB'
  },
  {
    id: '3',
    timestamp: '2024-01-14T09:15:00Z',
    template: 'Detailed Expenses',
    destination: 'Google Sheets → Budget 2024',
    status: 'processing',
    records: 234,
    size: '3.1 MB'
  },
  {
    id: '4',
    timestamp: '2024-01-13T16:20:00Z',
    template: 'Budget Tracker',
    destination: 'OneDrive → Reports/',
    status: 'failed',
    records: 67,
    size: '0.9 MB'
  }
];

export const CloudExportHub: React.FC<CloudExportHubProps> = ({ isOpen, onClose, expenses }) => {
  const [activeTab, setActiveTab] = useState<CloudTab>('integrations');
  const [shareLink, setShareLink] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [processingJobs, setProcessingJobs] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Generate a mock share link
      setShareLink(`https://expensetracker.app/shared/${Math.random().toString(36).substr(2, 9)}`);
    }
  }, [isOpen]);

  // Mock analytics data
  const analyticsData = useMemo(() => {
    const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryTotals = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return {
      totalRecords: expenses.length,
      totalAmount,
      avgPerTransaction: expenses.length > 0 ? totalAmount / expenses.length : 0,
      topCategory: Object.entries(categoryTotals).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None',
      monthlyGrowth: 12.5
    };
  }, [expenses]);

  const handleIntegrationConnect = (integrationId: string) => {
    // Simulate connection process
    setProcessingJobs(prev => [...prev, integrationId]);
    setTimeout(() => {
      setProcessingJobs(prev => prev.filter(id => id !== integrationId));
    }, 2000);
  };

  const handleTemplateExport = (templateId: string, destination: string) => {
    setProcessingJobs(prev => [...prev, `${templateId}-${destination}`]);
    setTimeout(() => {
      setProcessingJobs(prev => prev.filter(id => id !== `${templateId}-${destination}`));
    }, 3000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  const generateQRCode = () => {
    setShowQR(!showQR);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'integrations', label: 'Integrations', icon: <Cloud className="w-4 h-4" /> },
    { id: 'templates', label: 'Templates', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'share', label: 'Share', icon: <Share2 className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'schedule', label: 'Schedule', icon: <Clock className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Cloud className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Cloud Export Hub</h2>
                  <p className="text-blue-100 mt-1">Connect, share, and collaborate with your expense data</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="bg-white/10 px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{analyticsData.totalRecords}</div>
                  <div className="text-blue-100 text-sm">Total Records</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${analyticsData.totalAmount.toFixed(0)}</div>
                  <div className="text-blue-100 text-sm">Total Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{CLOUD_INTEGRATIONS.filter(i => i.connected).length}</div>
                  <div className="text-blue-100 text-sm">Connected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 mr-1" />
                    +{analyticsData.monthlyGrowth}%
                  </div>
                  <div className="text-blue-100 text-sm">Growth</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as CloudTab)}
                  className={`flex items-center px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                  {tab.id === 'history' && (
                    <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {SAMPLE_HISTORY.length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Cloud Integrations</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Sync className="w-4 h-4 animate-spin" />
                    <span>Auto-sync enabled</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {CLOUD_INTEGRATIONS.map(integration => (
                    <div key={integration.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{integration.icon}</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{integration.name}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className={`w-2 h-2 rounded-full ${
                                integration.status === 'active' ? 'bg-green-500' :
                                integration.status === 'syncing' ? 'bg-blue-500 animate-pulse' :
                                integration.status === 'error' ? 'bg-red-500' :
                                'bg-gray-400'
                              }`} />
                              <span className="text-sm text-gray-600 capitalize">{integration.status}</span>
                            </div>
                          </div>
                        </div>
                        {integration.connected && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{integration.description}</p>

                      <div className="space-y-2 mb-4">
                        {integration.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle2 className="w-3 h-3 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {integration.lastSync && (
                        <div className="text-xs text-gray-500 mb-4">
                          Last sync: {integration.lastSync}
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant={integration.connected ? "outline" : "default"}
                        onClick={() => handleIntegrationConnect(integration.id)}
                        disabled={processingJobs.includes(integration.id)}
                        className="w-full"
                      >
                        {processingJobs.includes(integration.id) ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {integration.connected ? 'Syncing...' : 'Connecting...'}
                          </>
                        ) : integration.connected ? (
                          <>
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Export Templates</h3>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Template
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {EXPORT_TEMPLATES.map(template => (
                    <div key={template.id} className="bg-white border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            {template.icon}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{template.name}</h4>
                              {template.popular && (
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                template.category === 'business' ? 'bg-blue-100 text-blue-800' :
                                template.category === 'personal' ? 'bg-green-100 text-green-800' :
                                template.category === 'tax' ? 'bg-red-100 text-red-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {template.category}
                              </span>
                              <span className="text-sm text-gray-500 uppercase">{template.format}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="text-sm font-medium text-gray-700">Includes:</div>
                        <div className="flex flex-wrap gap-1">
                          {template.fields.map((field, idx) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleTemplateExport(template.id, 'download')}
                          disabled={processingJobs.includes(`${template.id}-download`)}
                          className="flex-1"
                        >
                          {processingJobs.includes(`${template.id}-download`) ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          Export
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTemplateExport(template.id, 'cloud')}
                          disabled={processingJobs.includes(`${template.id}-cloud`)}
                        >
                          {processingJobs.includes(`${template.id}-cloud`) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'share' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Your Data</h3>
                  <p className="text-gray-600">Generate secure links and collaborate with your team</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Share Options */}
                  <div className="space-y-6">
                    <Card title="Quick Share">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Link className="w-5 h-5 text-blue-500" />
                            <div>
                              <div className="font-medium">Shareable Link</div>
                              <div className="text-sm text-gray-600">Anyone with link can view</div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={handleCopyLink}>
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                            <Button size="sm" variant="outline" onClick={generateQRCode}>
                              <QrCode className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                          <Input
                            type="text"
                            value={shareLink}
                            readOnly
                            className="font-mono text-sm"
                          />
                        </div>

                        {showQR && (
                          <div className="text-center p-6 bg-gray-50 rounded-lg">
                            <div className="w-32 h-32 bg-gray-300 mx-auto rounded-lg flex items-center justify-center">
                              <QrCode className="w-16 h-16 text-gray-500" />
                            </div>
                            <p className="text-sm text-gray-600 mt-2">QR Code for mobile sharing</p>
                          </div>
                        )}
                      </div>
                    </Card>

                    <Card title="Team Collaboration">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Input
                            placeholder="Enter email address"
                            className="flex-1"
                          />
                          <Button size="sm">
                            <Users className="w-4 h-4 mr-1" />
                            Invite
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                                JD
                              </div>
                              <div>
                                <div className="font-medium text-sm">john.doe@company.com</div>
                                <div className="text-xs text-gray-600">Editor</div>
                              </div>
                            </div>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Shield className="w-4 h-4" />
                          <span>All shares are encrypted and expire in 30 days</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Share Analytics */}
                  <div className="space-y-6">
                    <Card title="Share Analytics">
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">24</div>
                            <div className="text-sm text-gray-600">Total Views</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">7</div>
                            <div className="text-sm text-gray-600">Active Shares</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Monthly Report</span>
                            <span className="font-medium">12 views</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tax Documents</span>
                            <span className="font-medium">8 views</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Budget Analysis</span>
                            <span className="font-medium">4 views</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card title="Export Options">
                      <div className="space-y-3">
                        {['Email Report', 'Download PDF', 'Share via Slack', 'Post to Notion'].map((option, idx) => (
                          <button
                            key={idx}
                            className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              {idx === 0 && <Mail className="w-5 h-5 text-red-500" />}
                              {idx === 1 && <Download className="w-5 h-5 text-blue-500" />}
                              {idx === 2 && <MessageSquare className="w-5 h-5 text-purple-500" />}
                              {idx === 3 && <FileText className="w-5 h-5 text-gray-600" />}
                              <span className="font-medium">{option}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Export History</h3>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="w-4 h-4 mr-2" />
                      Archive
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {SAMPLE_HISTORY.map(item => (
                    <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === 'completed' ? 'bg-green-500' :
                            item.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                            item.status === 'failed' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`} />
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.template}</h4>
                            <p className="text-sm text-gray-600">{item.destination}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {formatDate(item.timestamp)}
                          </div>
                          <div className="text-sm text-gray-600 capitalize">{item.status}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">{item.records}</div>
                          <div className="text-sm text-gray-600">Records</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">{item.size}</div>
                          <div className="text-sm text-gray-600">File Size</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="font-semibold text-gray-900">
                            {item.sharedWith ? item.sharedWith.length : 0}
                          </div>
                          <div className="text-sm text-gray-600">Shared With</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        {item.sharedWith && item.sharedWith.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              Shared with {item.sharedWith.slice(0, 2).join(', ')}
                              {item.sharedWith.length > 2 && ` +${item.sharedWith.length - 2} more`}
                            </span>
                          </div>
                        )}

                        <div className="flex space-x-2 ml-auto">
                          {item.status === 'failed' && (
                            <Button size="sm" variant="outline">
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Retry
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Automated Schedules</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Schedule
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Active Schedules */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Active Schedules</h4>

                    <div className="space-y-4">
                      {[
                        {
                          name: 'Monthly Tax Report',
                          frequency: 'Monthly on 1st',
                          template: 'Tax Report',
                          destination: 'Gmail → accountant@firm.com',
                          nextRun: '2024-02-01T09:00:00Z',
                          status: 'active'
                        },
                        {
                          name: 'Weekly Team Summary',
                          frequency: 'Weekly on Monday',
                          template: 'Monthly Summary',
                          destination: 'Slack → #finance-team',
                          nextRun: '2024-01-22T10:00:00Z',
                          status: 'paused'
                        }
                      ].map((schedule, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-lg p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h5 className="font-semibold text-gray-900">{schedule.name}</h5>
                              <p className="text-sm text-gray-600">{schedule.frequency}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className={`w-2 h-2 rounded-full ${
                                schedule.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                              }`} />
                              <span className="text-sm text-gray-600 capitalize">{schedule.status}</span>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Template:</span>
                              <span className="font-medium">{schedule.template}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Destination:</span>
                              <span className="font-medium">{schedule.destination}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Next Run:</span>
                              <span className="font-medium">{formatDate(schedule.nextRun)}</span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              {schedule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Builder */}
                  <div>
                    <Card title="Create New Schedule">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Schedule Name
                          </label>
                          <Input placeholder="e.g., Monthly Budget Report" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Template
                          </label>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option>Select template...</option>
                            {EXPORT_TEMPLATES.map(template => (
                              <option key={template.id} value={template.id}>{template.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frequency
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(freq => (
                              <button
                                key={freq}
                                className="p-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                              >
                                {freq}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Destination
                          </label>
                          <div className="space-y-2">
                            {['Email', 'Slack', 'Google Sheets', 'Dropbox'].map(dest => (
                              <label key={dest} className="flex items-center">
                                <input type="radio" name="destination" className="mr-2" />
                                <span className="text-sm">{dest}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                          <Bell className="w-5 h-5 text-blue-500" />
                          <span className="text-sm text-blue-700">
                            You'll receive notifications before each scheduled export
                          </span>
                        </div>

                        <Button className="w-full">
                          Create Schedule
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">Export Analytics</h3>
                  <div className="flex space-x-2">
                    <select className="p-2 border border-gray-300 rounded-md text-sm">
                      <option>Last 30 days</option>
                      <option>Last 90 days</option>
                      <option>Last year</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-blue-600">{analyticsData.totalRecords}</div>
                      <div className="text-sm text-gray-600">Total Records</div>
                      <div className="flex items-center justify-center mt-2 text-green-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-xs">+12% this month</span>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-green-600">
                        ${analyticsData.totalAmount.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Value</div>
                      <div className="flex items-center justify-center mt-2 text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="text-xs">${analyticsData.avgPerTransaction.toFixed(0)} avg</span>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-purple-600">47</div>
                      <div className="text-sm text-gray-600">Exports Created</div>
                      <div className="flex items-center justify-center mt-2 text-purple-600">
                        <Download className="w-4 h-4 mr-1" />
                        <span className="text-xs">8 this week</span>
                      </div>
                    </div>
                  </Card>

                  <Card>
                    <div className="text-center p-4">
                      <div className="text-3xl font-bold text-orange-600">156</div>
                      <div className="text-sm text-gray-600">Total Shares</div>
                      <div className="flex items-center justify-center mt-2 text-orange-600">
                        <Share2 className="w-4 h-4 mr-1" />
                        <span className="text-xs">24 active</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card title="Popular Templates">
                    <div className="space-y-4">
                      {EXPORT_TEMPLATES
                        .filter(t => t.popular)
                        .map(template => (
                          <div key={template.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                {template.icon}
                              </div>
                              <div>
                                <div className="font-medium">{template.name}</div>
                                <div className="text-sm text-gray-600">{template.category}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {template.id === 'tax-report' ? '23' :
                                 template.id === 'monthly-summary' ? '18' : '12'} uses
                              </div>
                              <div className="text-sm text-gray-600">this month</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>

                  <Card title="Integration Usage">
                    <div className="space-y-4">
                      {CLOUD_INTEGRATIONS
                        .filter(i => i.connected)
                        .map(integration => (
                          <div key={integration.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">{integration.icon}</div>
                              <div>
                                <div className="font-medium">{integration.name}</div>
                                <div className="text-sm text-gray-600">{integration.lastSync}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">
                                {integration.id === 'google-sheets' ? '156' :
                                 integration.id === 'dropbox' ? '89' :
                                 integration.id === 'gmail' ? '234' : '67'} exports
                              </div>
                              <div className="text-sm text-gray-600">total</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All systems operational</span>
              </div>
              <div className="text-sm text-gray-600">
                Last sync: 2 minutes ago
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button>
                <Cloud className="w-4 h-4 mr-2" />
                Sync Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};