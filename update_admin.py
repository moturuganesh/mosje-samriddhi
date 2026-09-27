with open('frontend/src/components/AdminDashboard.jsx', 'rb') as f:
    content = f.read().decode('utf-8')

content = content.replace(',1', '₹')

replacement = """<td className="p-3 text-right flex items-center justify-end gap-2">
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.arn, e.target.value)}
                            className="bg-slate-800 text-white font-bold text-xs px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                          >
                            <option value="Routed to Branch">1. Routed to Branch</option>
                            <option value="Pending Physical KYC">2. Pending Physical KYC</option>
                            <option value="Loan Approved & Disbursed">3. Loan Disbursed</option>
                            <option value="Rejected">4. Rejected</option>
                          </select>
                          <button
                            onClick={() => handleDeleteApplication(app.arn)}
                            className="px-2 py-1 rounded bg-rose-100 text-rose-700 hover:bg-rose-200 hover:text-rose-800 text-xs font-bold transition-all shadow-sm"
                            title="Delete Application"
                          >
                            Delete
                          </button>
                        </td>"""

old_target = """<td className="p-3 text-right">
                          <select 
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.arn, e.target.value)}
                            className="bg-slate-800 text-white font-bold text-xs px-2 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                          >
                            <option value="Routed to Branch">1. Routed to Branch</option>
                            <option value="Pending Physical KYC">2. Pending Physical KYC</option>
                            <option value="Loan Approved & Disbursed">3. Loan Disbursed</option>
                            <option value="Rejected">4. Rejected</option>
                          </select>
                        </td>"""

content = content.replace(old_target, replacement)

with open('frontend/src/components/AdminDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
