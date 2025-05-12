import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import './BlogDetail.css'; 
import Sidebar from '../components/Sidebar';
import { auth } from '../firebase'; 
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';


const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/'); // Redirect to home or login page
      } catch (error) {
        console.error('Logout error:', error.message);
      }
    };

  
  
  // In a real app, you would fetch this data from an API
  const blogs = {
    1: {
      title: "10 Strategies to Beat Inflation in 2025",
      content: [
        "Inflation can erode your purchasing power, but there are strategies to protect yourself. Here are 10 effective ways to beat inflation:",
        "1. Invest in Treasury Inflation-Protected Securities (TIPS) - These government bonds adjust with inflation.",
        "2. Consider real estate - Property values and rents typically rise with inflation.",
        "3. Invest in stocks - Especially companies with pricing power that can pass costs to consumers.",
        "4. Increase your income - Negotiate raises or develop side hustles.",
        "5. Reduce discretionary spending - Cut back on non-essential purchases.",
        "6. Pay down debt - Fixed-rate debts become cheaper in real terms during inflation.",
        "7. Diversify internationally - Some currencies and economies handle inflation better.",
        "8. Invest in commodities - Gold and other commodities often rise with inflation.",
        "9. Review your budget regularly - Adjust spending categories as prices change.",
        "10. Delay large purchases - If possible, wait for more stable economic conditions."
      ],
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      author: "Jane Smith",
      date: `${new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}`,
      readTime: "8 min read"
    },
    2: {
      title: "The 50/30/20 Budget Rule Explained",
      content: [
        "The 50/30/20 rule is a simple budgeting framework that helps you allocate your after-tax income effectively:",
        "<strong>50% for Needs:</strong>",
        "- Housing (rent/mortgage)",
        "- Utilities",
        "- Groceries",
        "- Transportation",
        "- Minimum debt payments",
        "- Insurance",
        "",
        "<strong>30% for Wants:</strong>",
        "- Dining out",
        "- Entertainment",
        "- Travel",
        "- Hobbies",
        "- Luxury items",
        "",
        "<strong>20% for Savings & Debt:</strong>",
        "- Emergency fund",
        "- Retirement accounts",
        "- Investments",
        "- Extra debt payments",
        "- Education fund",
        "",
        "This method provides flexibility while ensuring financial stability. Adjust percentages slightly based on your circumstances."
      ],
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1511&q=80",
      author: "Michael Johnson",
      date: `${new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}`,
      readTime: "6 min read"
    },
    3: {
      title: "Tracking Expenses: Apps vs Spreadsheets",
      content: [
        "Effective expense tracking is crucial for financial health. Here's a detailed comparison:",
        "",
        "<strong>Mobile Apps (Mint, YNAB, PocketGuard)</strong>",
        "✅ Automatic transaction syncing",
        "✅ Real-time updates",
        "✅ Receipt scanning",
        "✅ Budget alerts",
        "❌ Limited customization",
        "❌ Privacy concerns with bank connections",
        "",
        "<strong>Spreadsheets (Excel, Google Sheets)</strong>",
        "✅ Complete control over categories",
        "✅ No bank account linking needed",
        "✅ Powerful analysis capabilities",
        "✅ Free or low-cost",
        "❌ Manual data entry required",
        "❌ Steeper learning curve",
        "",
        "<strong>Hybrid Approach:</strong>",
        "Many users combine both - using apps for daily tracking and spreadsheets for monthly analysis. Consider your tech comfort level and how detailed you want your tracking to be."
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80",
      author: "Sarah Williams",
      date:`${new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}`,
      readTime: "7 min read"
    },
    4: {
      title: "Side Hustles to Boost Your Income",
      content: [
        "In today's economy, multiple income streams are valuable. Here are 12 legitimate side hustles:",
        "",
        "<strong>Online Opportunities:</strong>",
        "1. Freelancing (writing, design, programming) - Platforms: Upwork, Fiverr",
        "2. Virtual assistance - $15-$30/hour",
        "3. Online tutoring - Specialize in academic subjects or test prep",
        "",
        "<strong>Local Services:</strong>",
        "4. Pet sitting/dog walking - Use Rover or local networks",
        "5. Home organization - Help declutter spaces",
        "6. Meal prep service - Cook for busy families",
        "",
        "<strong>Creative Ventures:</strong>",
        "7. Print-on-demand stores - No inventory needed",
        "8. Stock photography - Sell your photos online",
        "9. Handmade crafts - Etsy or local markets",
        "",
        "<strong>Asset Utilization:</strong>",
        "10. Rent out storage space - Neighbor.com",
        "11. Car sharing - Turo for your vehicle",
        "12. Airbnb experiences - Lead local tours",
        "",
        "Choose something that aligns with your skills and available time. Even 5-10 hours/week can generate $300-$800/month."
      ],
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
      author: "David Chen",
      date: `${new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}`,
      readTime: "9 min read"
    },
    5: {
      title: "Investing During High Inflation Periods",
      content: [
        "When inflation rises above 5%, traditional investment strategies may need adjustment. Consider these asset classes:",
        "",
        "<strong>1. Value Stocks</strong>",
        "Companies with strong cash flows and pricing power tend to outperform during inflation. Look for sectors like:",
        "- Energy",
        "- Financials",
        "- Consumer staples",
        "",
        "<strong>2. Real Assets</strong>",
        "- REITs (Real Estate Investment Trusts)",
        "- Farmland investments",
        "- Infrastructure funds",
        "",
        "<strong>3. Commodities</strong>",
        "- Gold (traditional inflation hedge)",
        "- Silver (industrial uses plus store of value)",
        "- Oil and gas (energy sector benefits)",
        "",
        "<strong>4. Inflation-Linked Bonds</strong>",
        "- TIPS (Treasury Inflation-Protected Securities)",
        "- Corporate inflation-linked bonds",
        "",
        "<strong>5. Floating Rate Funds</strong>",
        "These invest in loans with interest rates that adjust with market rates.",
        "",
        "Diversification remains key - don't put all your money in one inflation hedge. Rebalance quarterly during volatile periods."
      ],
      image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      author: "Emily Rodriguez",
      date:`${new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}`,
      readTime: "8 min read"
    },
    6: {
      title: "Emergency Funds: How Much is Enough?",
      content: [
        "An emergency fund is your financial safety net. Here's how to build and maintain one:",
        "",
        "<strong>Standard Recommendation:</strong>",
        "3-6 months of living expenses",
        "",
        "<strong>Factors That Might Require More:</strong>",
        "- Single income household → 6-9 months",
        "- Commission-based income → 6-12 months",
        "- High-cost medical needs → Additional $5k-$10k",
        "- Older vehicle → Extra repair fund",
        "",
        "<strong>Where to Keep It:</strong>",
        "1. High-yield savings account (1.5-4% APY)",
        "2. Money market account (check-writing privileges)",
        "3. Short-term CDs (ladder for better rates)",
        "",
        "<strong>Building Your Fund:</strong>",
        "1. Start small ($500-1,000 initial goal)",
        "2. Automate monthly transfers",
        "3. Use windfalls (tax refunds, bonuses)",
        "4. Cut one discretionary expense temporarily",
        "",
        "<strong>When to Use It:</strong>",
        "- Job loss",
        "- Medical emergency",
        "- Essential home/car repairs",
        "- NOT for vacations or planned purchases",
        "",
        "Review your fund amount annually or after major life changes."
      ],
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
      author: "Robert Kim",
      date: `${new Date().toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" })}`,
      readTime: "7 min read"
    }
  };
  const blog = blogs[id];

  if (!blog) {
    return <Container className="my-5"><h2>Blog not found</h2></Container>;
  }

  return (
    <div className="d-flex">
  <Sidebar />

  <Container className="blog-detail-container py-5">
    {/* Header with Glassmorphism Effect */}
    <div className="blog-header p-4 mb-5 rounded-4" style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.18)'
    }}>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="blog-title m-0" style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: '#2d3436',
          fontSize: '2.5rem',
          background: 'linear-gradient(90deg, #6c5ce7, #2d3436)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {blog.title}
        </h1>

        <button 
          className="logout-btn"
          onClick={handleLogout}
          style={{
            background: 'none',
            border: '2px solid #ff6b6b',
            borderRadius: '50px',
            padding: '8px 20px',
            color: '#ff6b6b',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>

      {/* Blog Meta with Icons */}
      <div className="d-flex justify-content-center gap-4 mt-4">
        <div className="d-flex align-items-center" style={{ color: '#636e72' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#636e72" style={{ marginRight: '6px' }}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>{blog.author}</span>
        </div>
        <div className="d-flex align-items-center" style={{ color: '#636e72' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#636e72" style={{ marginRight: '6px' }}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>{blog.date}</span>
        </div>
        <div className="d-flex align-items-center" style={{ color: '#636e72' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#636e72" style={{ marginRight: '6px' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>{blog.readTime}</span>
        </div>
      </div>
    </div>

    {/* Featured Image with Gradient Overlay */}
    <div className="position-relative mb-5 rounded-4 overflow-hidden" style={{
      height: '400px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
    }}>
      <img 
        src={blog.image} 
        alt={blog.title} 
        className="w-100 h-100 object-fit-cover"
      />
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
      }}></div>
    </div>

    {/* Article Content with Beautiful Typography */}
    <article className="blog-content mb-5" style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: '#2d3436'
    }}>
      {blog.content.map((paragraph, index) => (
        <p 
          key={index} 
          className={index === 0 ? "lead mb-4" : "mb-3"}
          style={{
            fontSize: index === 0 ? '1.3rem' : '1.1rem',
            fontWeight: index === 0 ? 500 : 400
          }}
          dangerouslySetInnerHTML={{ __html: paragraph }}
        />
      ))}
    </article>

    {/* Back Button with Hover Animation */}
    <div className="text-center mt-5">
      <Link to="/support">
        <button className="back-btn" style={{
          background: 'none',
          border: '2px solid #6c5ce7',
          borderRadius: '50px',
          padding: '12px 28px',
          color: '#6c5ce7',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <span className="position-relative z-1">
            ← Back to All Blogs
          </span>
          <span className="position-absolute top-0 start-0 w-100 h-100" style={{
            background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
            transform: 'translateY(100%)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            zIndex: 0
          }}></span>
        </button>
      </Link>
    </div>
  </Container>
</div>
  );
};


export default BlogDetail;