import { Link } from 'react-router-dom';
import { motion, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

function AnimatedCounter({ value, duration = 2 }: { value: number; duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      delay: 0.8,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.floor(latest));
      }
    });

    return controls.stop;
  }, [value, duration]);

  return <>{displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</>;
}

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface font-body text-body min-h-screen flex flex-col antialiased selection:bg-secondary-container selection:text-on-surface">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm font-sans font-medium text-sm antialiased transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
            Finance Tracker
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-500 hover:text-slate-900 transition-colors duration-200">Features</a>
            <a href="#pricing" className="text-slate-500 hover:text-slate-900 transition-colors duration-200">Pricing</a>
            <Link to="/faq" className="text-slate-500 hover:text-slate-900 transition-colors duration-200">FAQs</Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/sign-in" className="text-slate-700 hover:text-slate-900 transition-colors duration-200 active:scale-95 transition-transform">Sign In</Link>
            <Link to="/sign-up" className="bg-primary-container text-white px-5 py-2.5 rounded-lg hover:bg-primary-dim transition-colors duration-200 font-medium active:scale-95 transition-transform">Get Started</Link>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden text-slate-700">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </motion.nav>

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden px-6">
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="max-w-7xl mx-auto relative z-10 text-center">
            <motion.p
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-violet-600 font-label text-sm uppercase tracking-wider mb-6 font-semibold inline-flex items-center gap-2 bg-violet-50 px-4 py-1.5 rounded-full border border-violet-100">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              B2B Expense Management, Redefined.
            </motion.p>
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
              Collaborative Financial Tracking for Modern Teams.
            </motion.h1>
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unify your organization's spending, automate approvals, and gain real-time visibility into your cash flow with enterprise-grade precision and a clean, modern interface.
            </motion.p>
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/sign-up" className="bg-primary-container text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-dim transition-all shadow-md hover:shadow-lg w-full sm:w-auto flex items-center justify-center gap-2">
                  Get Started Free
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/dashboard" className="bg-white border border-gray-200 text-slate-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-all w-full sm:w-auto flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">play_circle</span>
                  View Demo
                </Link>
              </motion.div>
            </motion.div>

            {/* Dashboard Mockup */}
            <motion.div
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="relative max-w-5xl mx-auto">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gradient-to-b from-violet-50 to-transparent blur-3xl -z-10 rounded-full opacity-50"></div>
              <div className="bg-white/70 backdrop-blur-md shadow-sm border border-gray-200 rounded-lg p-2 md:p-4 relative overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 mb-4">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="text-xs font-medium text-slate-600">Finance Dashboard</div>
                  </div>
                </div>
                <div className="flex justify-center p-2 md:p-4 gap-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="w-full md:w-[65%] bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg p-6 shadow-2xl flex flex-col justify-between">
                    <div>
                      <p className="text-slate-300 font-semibold text-sm mb-1 uppercase tracking-wide">Balance</p>
                      <h2 className="text-5xl font-bold text-white tracking-tight">
                        $<AnimatedCounter value={45231} duration={2} />
                      </h2>
                      <p className="text-emerald-400 text-sm font-medium flex items-center mt-2">
                        <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                        +12.5% this month
                      </p>
                    </div>
                    <div className="mt-8 h-40 relative flex items-end justify-between gap-2 px-2">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 1.0, ease: "easeOut" }}
                        style={{ originY: 1 }}
                        className="w-full bg-white/10 rounded-t-sm h-[40%] hover:bg-white/20 transition-colors"></motion.div>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
                        style={{ originY: 1 }}
                        className="w-full bg-white/20 rounded-t-sm h-[60%] hover:bg-white/30 transition-colors"></motion.div>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
                        style={{ originY: 1 }}
                        className="w-full bg-white/10 rounded-t-sm h-[30%] hover:bg-white/20 transition-colors"></motion.div>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 1.3, ease: "easeOut" }}
                        style={{ originY: 1 }}
                        className="w-full bg-white/30 rounded-t-sm h-[80%] hover:bg-white/40 transition-colors"></motion.div>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
                        style={{ originY: 1 }}
                        className="w-full bg-white rounded-t-sm h-[100%] shadow-sm relative group cursor-pointer">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          May: $12k
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 1.5, ease: "easeOut" }}
                        style={{ originY: 1 }}
                        className="w-full bg-white/20 rounded-t-sm h-[70%] hover:bg-white/30 transition-colors"></motion.div>
                    </div>
                  </motion.div>

                  {/* Side Stats */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="hidden md:flex flex-col gap-3 w-[30%]">
                    {/* Income Card */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 uppercase">Income</span>
                        <span className="material-symbols-outlined text-emerald-500 text-sm">arrow_downward</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">$8,420</p>
                      <p className="text-xs text-emerald-600 mt-1">+18% from last month</p>
                    </div>

                    {/* Expenses Card */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-500 uppercase">Expenses</span>
                        <span className="material-symbols-outlined text-red-500 text-sm">arrow_upward</span>
                      </div>
                      <p className="text-2xl font-bold text-slate-900">$3,189</p>
                      <p className="text-xs text-slate-500 mt-1">-5% from last month</p>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex-1">
                      <p className="text-xs font-medium text-slate-500 uppercase mb-3">Recent</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-violet-600" style={{ fontSize: '14px' }}>shopping_cart</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-700 truncate">Amazon</p>
                            <p className="text-[10px] text-slate-400">2 hours ago</p>
                          </div>
                          <p className="text-xs font-semibold text-slate-900">-$89</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-600" style={{ fontSize: '14px' }}>payments</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-700 truncate">Salary</p>
                            <p className="text-[10px] text-slate-400">Yesterday</p>
                          </div>
                          <p className="text-xs font-semibold text-emerald-600">+$4,200</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-orange-600" style={{ fontSize: '14px' }}>restaurant</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-700 truncate">Starbucks</p>
                            <p className="text-[10px] text-slate-400">Yesterday</p>
                          </div>
                          <p className="text-xs font-semibold text-slate-900">-$12</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-12 border-y border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-slate-500 font-medium text-sm mb-8 tracking-wide">TRUSTED BY 1,000+ MODERN TEAMS WORLDWIDE</motion.p>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <div className="w-8 h-8 rounded-lg bg-slate-800 rotate-45 flex items-center justify-center"><div className="w-3 h-3 bg-white rounded-sm"></div></div> AcmeCorp
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <div className="w-8 h-8 rounded-full border-4 border-slate-800"></div> GlobalTech
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 font-bold text-xl text-slate-800">
                <div className="w-8 h-8 bg-slate-800 rounded-sm flex items-center justify-center text-white text-xs">NL</div> NexusLabs
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 font-bold text-xl text-slate-800 hidden sm:flex">
                <div className="w-8 h-8 rounded-tl-lg rounded-br-lg bg-slate-800"></div> Zenith
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="flex items-center gap-2 font-bold text-xl text-slate-800 hidden md:flex">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center"><div className="w-4 h-4 bg-white rounded-full"></div></div> Horizon
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Bento Grid Features */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">Enterprise Power. <br/> Consumer Simplicity.</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Everything you need to manage company finances without the clutter. Designed for clarity, built for scale.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Feature 1 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="md:col-span-2 bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute right-0 top-0 w-64 h-64 bg-violet-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 group-hover:opacity-80 transition-opacity"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-2xl">monitoring</span>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Deep Analytics</h3>
                <p className="text-slate-600 max-w-md">Uncover hidden spending patterns with interactive, real-time charts. Export detailed reports with a single click.</p>
              </div>
              <div className="relative z-10 mt-6 flex items-end gap-3 h-24 opacity-80">
                <div className="w-8 bg-violet-200 rounded-t h-[40%]"></div>
                <div className="w-8 bg-violet-200 rounded-t h-[60%]"></div>
                <div className="w-8 bg-violet-300 rounded-t h-[80%] border-t-2 border-violet-500"></div>
                <div className="w-8 bg-violet-200 rounded-t h-[50%]"></div>
                <div className="w-8 bg-violet-200 rounded-t h-[70%]"></div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col group">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">group_work</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">Seamless Collaboration</h3>
              <p className="text-slate-600">Invite team members, set granular permissions, and manage approval workflows effortlessly.</p>
              <div className="mt-auto pt-6 flex -space-x-3">
                <div className="w-10 h-10 rounded-full bg-violet-200 border-2 border-white flex items-center justify-center text-xs font-bold text-violet-700">JD</div>
                <div className="w-10 h-10 rounded-full bg-emerald-200 border-2 border-white flex items-center justify-center text-xs font-bold text-emerald-700">AS</div>
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center text-xs font-bold text-white">+3</div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col group">
              <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">currency_exchange</span>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3">Multi-Currency</h3>
              <p className="text-slate-600">Handle international expenses with automatic conversion rates and native foreign account support.</p>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="md:col-span-2 bg-gray-50 rounded-lg border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group">
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-2xl">account_balance</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3">Smart Budgets</h3>
                  <p className="text-slate-600">Create departmental budgets that enforce limits automatically. Get alerted before you overspend.</p>
                </div>
                <div className="w-full md:w-64 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Q3 Marketing</span>
                    <span className="text-slate-500">85%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4">
                    <div className="bg-violet-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Engineering</span>
                    <span className="text-slate-500">42%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Choose the plan that fits your team's needs.</p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Basic</h3>
              <p className="text-slate-500 text-sm mb-6">For small teams getting started.</p>
              <div className="text-4xl font-semibold text-slate-900 mb-8">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-grow text-slate-600">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-slate-400">check</span>Up to 3 users</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-slate-400">check</span>Basic analytics</li>
              </ul>
              <Link to="/sign-up" className="w-full py-2 px-4 border border-gray-200 text-slate-700 rounded-lg hover:bg-gray-50 font-medium transition-colors block text-center">Get Started</Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
              className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col shadow-2xl relative ring-2 ring-primary-container">
              <div className="absolute top-0 right-0 bg-primary-container text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">RECOMMENDED</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Pro</h3>
              <p className="text-slate-500 text-sm mb-6">For growing businesses.</p>
              <div className="text-4xl font-semibold text-slate-900 mb-8">$49<span className="text-lg text-slate-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 flex-grow text-slate-600">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-slate-400">check</span>Unlimited users</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-slate-400">check</span>Advanced analytics</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-slate-400">check</span>Automated workflows</li>
              </ul>
              <Link to="/sign-up" className="w-full py-2 px-4 bg-primary-container text-white rounded-lg hover:bg-primary-dim font-medium transition-colors block text-center">Start Free Trial</Link>
            </motion.div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h3>
              <p className="text-slate-500 text-sm mb-6">For large organizations.</p>
              <div className="text-4xl font-semibold text-slate-900 mb-8">Custom</div>
              <ul className="space-y-4 mb-8 flex-grow text-slate-600">
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-slate-400">check</span>Custom integrations</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-slate-400">check</span>Dedicated account manager</li>
                <li className="flex items-center gap-2"><span className="material-symbols-outlined text-sm text-slate-400">check</span>24/7 priority support</li>
              </ul>
              <Link to="/contact" className="w-full py-2 px-4 border border-gray-200 text-slate-700 rounded-lg hover:bg-gray-50 font-medium transition-colors block text-center">Contact Us</Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Dark Section */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}>
              <h2 className="text-3xl font-semibold text-white mb-6">Put Your Finances on Autopilot.</h2>
              <p className="text-slate-300 font-body text-lg mb-8 leading-relaxed">
                Stop manually tracking recurring expenses. Define rules, schedule payments, and let Finance Tracker handle the tedious work while you focus on growing your business.
              </p>
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.15,
                      delayChildren: 0.3
                    }
                  }
                }}
                className="space-y-4 mb-10">
                <motion.li
                  variants={{
                    hidden: { x: -20, opacity: 0 },
                    visible: { x: 0, opacity: 1 }
                  }}
                  className="flex items-start gap-3 text-slate-300">
                  <span className="material-symbols-outlined text-violet-400 mt-1">check_circle</span>
                  Automated invoice parsing and categorization.
                </motion.li>
                <motion.li
                  variants={{
                    hidden: { x: -20, opacity: 0 },
                    visible: { x: 0, opacity: 1 }
                  }}
                  className="flex items-start gap-3 text-slate-300">
                  <span className="material-symbols-outlined text-emerald-400 mt-1">check_circle</span>
                  Scheduled recurring transfers with approval gates.
                </motion.li>
                <motion.li
                  variants={{
                    hidden: { x: -20, opacity: 0 },
                    visible: { x: 0, opacity: 1 }
                  }}
                  className="flex items-start gap-3 text-slate-300">
                  <span className="material-symbols-outlined text-cyan-400 mt-1">check_circle</span>
                  Real-time anomaly detection for unusual spending.
                </motion.li>
              </motion.ul>
              <motion.a
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{ x: 5 }}
                href="#" className="inline-flex items-center gap-2 text-violet-400 font-medium hover:text-violet-300 transition-colors">
                Explore Automation Features <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </motion.a>
            </motion.div>
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-lg p-6 shadow-2xl relative">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                <span className="material-symbols-outlined text-slate-400">schedule</span>
                <span className="font-semibold text-sm tracking-widest text-slate-300">CRON SCHEDULE / ACTIVE</span>
              </div>
              <div className="bg-slate-700/80 border border-white/5 rounded-lg p-5 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-white text-lg">Monthly Server Hosting</h4>
                    <p className="text-slate-400 text-sm mt-1">AWS Infrastructure • Dept: Engineering</p>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded border border-emerald-500/20 font-medium">Active</span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-500 text-sm">payments</span>
                    <span className="font-semibold text-white">$120.00</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    1st of every month
                  </div>
                </div>
              </div>
              <div className="bg-slate-700/50 border border-white/5 border-dashed rounded-lg p-4 flex items-center justify-center gap-3 text-slate-400 text-sm">
                <span className="material-symbols-outlined animate-pulse text-violet-400">sync</span>
                Next execution in 14 days
              </div>
            </motion.div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg p-12 text-center shadow-2xl relative overflow-hidden">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl font-semibold text-white mb-6">Ready to Take Control?</h2>
              <p className="text-slate-300 mb-10 text-lg">Join thousands of companies managing their finances with precision. Setup takes less than 5 minutes.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/sign-up" className="inline-block bg-white text-slate-900 px-10 py-5 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto text-center">
                  Create Your Free Organization
                </Link>
              </motion.div>
              <p className="text-sm text-slate-400 mt-4 font-medium">No credit card required • 14-day full feature trial</p>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full mt-auto border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 transition-all duration-150">
        <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              Finance Tracker
            </Link>
            <p className="text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-400">
              © 2024 Finance Tracker. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm font-normal leading-relaxed text-slate-600 dark:text-slate-400">
            <a href="#features" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Pricing</a>
            <Link to="/faq" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">FAQs</Link>
            <Link to="/privacy" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
