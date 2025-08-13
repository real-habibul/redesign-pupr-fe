// import * as React from "react";
// import {
//   AppBar,
//   Avatar,
//   Badge,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   CssBaseline,
//   Divider,
//   Drawer,
//   IconButton,
//   InputBase,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Paper,
//   Toolbar,
//   Typography,
//   useMediaQuery,
//   LinearProgress, Grid2 as Grid,
// } from "@mui/material";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import SearchIcon from "@mui/icons-material/Search";
// import MenuIcon from "@mui/icons-material/Menu";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import DashboardIcon from "@mui/icons-material/SpaceDashboard";
// import TableChartIcon from "@mui/icons-material/TableChart";
// import ShowChartIcon from "@mui/icons-material/ShowChart";
// import SettingsIcon from "@mui/icons-material/Settings";
// import LogoutIcon from "@mui/icons-material/Logout";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import TrendingUpIcon from "@mui/icons-material/TrendingUp";
// import TrendingDownIcon from "@mui/icons-material/TrendingDown";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// import { styled, alpha } from "@mui/material/styles";
// import Grid from "@mui/material/Grid";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Line,
//   BarChart,
//   Bar,
// } from "recharts";

// // -----------------------------
// // THEME (Poppins, rounded corners, soft shadows)
// // -----------------------------
// const theme = createTheme({
//   palette: {
//     mode: "light",
//     primary: { main: "#1D4ED8" },
//     secondary: { main: "#7C3AED" },
//     background: { default: "#F8FAFC", paper: "#FFFFFF" },
//   },
//   shape: { borderRadius: 16 },
//   typography: {
//     fontFamily: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
//     h1: { fontWeight: 700 },
//     h2: { fontWeight: 700 },
//     h3: { fontWeight: 700 },
//   },
//   components: {
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           boxShadow:
//             "0 10px 30px rgba(2, 6, 23, 0.06), 0 1px 2px rgba(2,6,23,0.06)",
//           border: "1px solid rgba(2,6,23,0.06)",
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: { borderRadius: 16 },
//       },
//     },
//   },
// });

// // -----------------------------
// // MOCK DATA
// // -----------------------------
// const kpis = [
//   {
//     title: "Total Orders",
//     value: "12,480",
//     delta: "+12.4%",
//     up: true,
//     icon: <TrendingUpIcon fontSize="small" />,
//   },
//   {
//     title: "Revenue",
//     value: "Rp 284.3J",
//     delta: "+3.2%",
//     up: true,
//     icon: <TrendingUpIcon fontSize="small" />,
//   },
//   {
//     title: "Refunds",
//     value: "126",
//     delta: "-1.8%",
//     up: false,
//     icon: <TrendingDownIcon fontSize="small" />,
//   },
//   {
//     title: "Uptime",
//     value: "99.98%",
//     delta: "stable",
//     up: true,
//     icon: <CheckCircleIcon fontSize="small" />,
//   },
// ];

// const chartData = [
//   { name: "Jan", uv: 400, pv: 240 },
//   { name: "Feb", uv: 600, pv: 139 },
//   { name: "Mar", uv: 800, pv: 980 },
//   { name: "Apr", uv: 650, pv: 390 },
//   { name: "Mei", uv: 900, pv: 480 },
//   { name: "Jun", uv: 1200, pv: 380 },
//   { name: "Jul", uv: 1500, pv: 430 },
//   { name: "Agu", uv: 1700, pv: 510 },
// ];

// const orders = [
//   { id: "ORD-9841", customer: "Dewi", status: "Paid", amount: "Rp 2.450.000" },
//   { id: "ORD-9840", customer: "Agus", status: "Processing", amount: "Rp 950.000" },
//   { id: "ORD-9839", customer: "Sari", status: "Refunded", amount: "Rp 350.000" },
//   { id: "ORD-9838", customer: "Budi", status: "Paid", amount: "Rp 5.120.000" },
//   { id: "ORD-9837", customer: "Anita", status: "Paid", amount: "Rp 1.250.000" },
// ];

// // -----------------------------
// // UTILS & STYLED
// // -----------------------------
// const drawerWidth = 260;

// const Search = styled("div")(({ theme }) => ({
//   position: "relative",
//   borderRadius: 16,
//   backgroundColor: alpha(theme.palette.common.black, 0.04),
//   "&:hover": { backgroundColor: alpha(theme.palette.common.black, 0.06) },
//   marginLeft: 0,
//   width: "100%",
//   [theme.breakpoints.up("sm")]: { marginLeft: theme.spacing(2), width: "auto" },
// }));

// const SearchIconWrapper = styled("div")(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: "100%",
//   position: "absolute",
//   pointerEvents: "none",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: "inherit",
//   width: "100%",
//   "& .MuiInputBase-input": {
//     padding: theme.spacing(1.2, 1.2, 1.2, 0),
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create("width"),
//     width: "100%",
//     [theme.breakpoints.up("md")]: { width: "32ch" },
//   },
// }));

// function StatusChip({ status }: { status: string }) {
//   const color =
//     status === "Paid" ? "success" : status === "Refunded" ? "error" : "warning";
//   return (
//     <Chip
//       label={status}
//       size="small"
//       color={color as any}
//       variant="outlined"
//     />
//   );
// }

// export default function CoolMuiDashboard() {
//   const [mobileOpen, setMobileOpen] = React.useState(false);
//   const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

//   const drawer = (
//     <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
//       <Box sx={{ p: 2.5 }}>
//         <Typography variant="h6" fontWeight={800}>
//           eKatalog<span style={{ color: theme.palette.primary.main }}>·</span>Dash
//         </Typography>
//         <Typography variant="body2" color="text.secondary">
//           Simple. Clean. Fast UI.
//         </Typography>
//       </Box>
//       <Divider />
//       <List sx={{ px: 1 }}>
//         {[
//           { icon: <DashboardIcon />, label: "Dashboard" },
//           { icon: <TableChartIcon />, label: "Orders" },
//           { icon: <ShowChartIcon />, label: "Analytics" },
//           { icon: <SettingsIcon />, label: "Settings" },
//         ].map((item) => (
//           <ListItemButton
//             key={item.label}
//             sx={{
//               mb: 0.5,
//               borderRadius: 2,
//               "&.Mui-selected": {
//                 bgcolor: alpha(theme.palette.primary.main, 0.08),
//               },
//               "&:hover": { bgcolor: alpha("#000", 0.04) },
//             }}
//             selected={item.label === "Dashboard"}
//           >
//             <ListItemIcon>{item.icon}</ListItemIcon>
//             <ListItemText primary={item.label} />
//           </ListItemButton>
//         ))}
//       </List>
//       <Box sx={{ flexGrow: 1 }} />
//       <Divider />
//       <List sx={{ px: 1, pb: 1 }}>
//         <ListItemButton sx={{ borderRadius: 2 }}>
//           <ListItemIcon>
//             <LogoutIcon />
//           </ListItemIcon>
//           <ListItemText primary="Logout" />
//         </ListItemButton>
//       </List>
//     </Box>
//   );

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
//         {/* AppBar */}
//         <AppBar
//           position="fixed"
//           elevation={0}
//           sx={{
//             bgcolor: "transparent",
//             backdropFilter: "saturate(180%) blur(10px)",
//             borderBottom: "1px solid rgba(2,6,23,0.06)",
//             color: "text.primary",
//           }}
//        >
//           <Toolbar>
//             {!isSmUp && (
//               <IconButton edge="start" onClick={handleDrawerToggle} aria-label="menu">
//                 <MenuIcon />
//               </IconButton>
//             )}
//             <Typography variant="h6" sx={{ fontWeight: 700 }}>
//               Dashboard
//             </Typography>
//             <Search sx={{ ml: 2 }}>
//               <SearchIconWrapper>
//                 <SearchIcon />
//               </SearchIconWrapper>
//               <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
//             </Search>
//             <Box sx={{ flexGrow: 1 }} />
//             <IconButton>
//               <Badge color="secondary" variant="dot">
//                 <NotificationsIcon />
//               </Badge>
//             </IconButton>
//             <Avatar sx={{ ml: 1, width: 36, height: 36 }}>BA</Avatar>
//           </Toolbar>
//         </AppBar>

//         {/* Drawer */}
//         <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
//           <Drawer
//             variant={isSmUp ? "permanent" : "temporary"}
//             open={isSmUp ? true : mobileOpen}
//             onClose={handleDrawerToggle}
//             ModalProps={{ keepMounted: true }}
//             sx={{
//               "& .MuiDrawer-paper": {
//                 width: drawerWidth,
//                 boxSizing: "border-box",
//                 borderRight: "1px solid rgba(2,6,23,0.06)",
//               },
//             }}
//           >
//             {drawer}
//           </Drawer>
//         </Box>

//         {/* Main Content */}
//         <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
//           <Toolbar />

//           {/* KPI CARDS */}
//           <Grid container spacing={2}>
//             {kpis.map((kpi) => (
//               <Grid item xs={12} sm={6} lg={3} key={kpi.title}>
//                 <Card>
//                   <CardContent>
//                     <Box display="flex" alignItems="center" justifyContent="space-between">
//                       <Typography variant="body2" color="text.secondary">
//                         {kpi.title}
//                       </Typography>
//                       <Chip size="small" label={kpi.delta} color={kpi.up ? "success" : "error"} variant="outlined" />
//                     </Box>
//                     <Box mt={1.2} display="flex" alignItems="center" gap={1}>
//                       {kpi.icon}
//                       <Typography variant="h5" fontWeight={800}>
//                         {kpi.value}
//                       </Typography>
//                     </Box>
//                     <Box mt={1}>
//                       <LinearProgress variant="determinate" value={kpi.up ? 72 : 38} />
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//             ))}
//           </Grid>

//           {/* CHARTS */}
//           <Grid container spacing={2} mt={0.5}>
//             <Grid item xs={12} lg={8}>
//               <Card>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
//                     <Typography variant="h6">Revenue Overview</Typography>
//                     <Button size="small" endIcon={<MoreHorizIcon />} variant="outlined">
//                       Detail
//                     </Button>
//                   </Box>
//                   <Box sx={{ height: 280 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
//                         <defs>
//                           <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="#1D4ED8" stopOpacity={0.3} />
//                             <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0} />
//                           </linearGradient>
//                         </defs>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                         <XAxis dataKey="name" tickMargin={8} />
//                         <YAxis />
//                         <Tooltip />
//                         <Area type="monotone" dataKey="uv" stroke="#1D4ED8" fillOpacity={1} fill="url(#colorUv)" />
//                         <Line type="monotone" dataKey="pv" stroke="#7C3AED" strokeWidth={2} dot={false} />
//                       </AreaChart>
//                     </ResponsiveContainer>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} lg={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" mb={1}>
//                     Channel Mix
//                   </Typography>
//                   <Box sx={{ height: 280 }}>
//                     <ResponsiveContainer width="100%" height="100%">
//                       <BarChart data={chartData}>
//                         <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                         <XAxis dataKey="name" tickMargin={8} />
//                         <YAxis />
//                         <Tooltip />
//                         <Bar dataKey="uv" radius={[8, 8, 0, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </Box>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           {/* TABLE + TASKS */}
//           <Grid container spacing={2} mt={0.5}>
//             <Grid item xs={12} lg={8}>
//               <Card>
//                 <CardContent>
//                   <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
//                     <Typography variant="h6">Recent Orders</Typography>
//                     <Button size="small" variant="text">See all</Button>
//                   </Box>
//                   <Paper variant="outlined" sx={{ overflow: "hidden" }}>
//                     <Box sx={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", p: 1.5, bgcolor: "grey.50" }}>
//                       <Typography variant="caption" fontWeight={700}>Order ID</Typography>
//                       <Typography variant="caption" fontWeight={700}>Customer</Typography>
//                       <Typography variant="caption" fontWeight={700}>Status</Typography>
//                       <Typography variant="caption" fontWeight={700}>Amount</Typography>
//                     </Box>
//                     {orders.map((o, i) => (
//                       <Box key={o.id} sx={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr 1fr", p: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
//                         <Typography variant="body2" fontWeight={600}>{o.id}</Typography>
//                         <Typography variant="body2">{o.customer}</Typography>
//                         <Box>
//                           <StatusChip status={o.status} />
//                         </Box>
//                         <Typography variant="body2" fontWeight={600}>{o.amount}</Typography>
//                       </Box>
//                     ))}
//                   </Paper>
//                 </CardContent>
//               </Card>
//             </Grid>

//             <Grid item xs={12} lg={4}>
//               <Card>
//                 <CardContent>
//                   <Typography variant="h6" mb={1}>Tasks</Typography>
//                   <List>
//                     {[
//                       { label: "Cek stok vendor A", done: true },
//                       { label: "Sync FE x BE untuk VA payment", done: false },
//                       { label: "Rancang copy hero landing", done: false },
//                       { label: "QA mobile breakpoint", done: true },
//                     ].map((t) => (
//                       <ListItemButton key={t.label} sx={{ borderRadius: 2, mb: 0.5 }}>
//                         <ListItemIcon>
//                           <CheckCircleIcon color={t.done ? "success" : "disabled"} />
//                         </ListItemIcon>
//                         <ListItemText
//                           primary={t.label}
//                           primaryTypographyProps={{
//                             sx: t.done ? { textDecoration: "line-through", color: "text.secondary" } : {},
//                           }}
//                         />
//                       </ListItemButton>
//                     ))}
//                   </List>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>

//           <Box height={24} />
//           <Typography variant="caption" color="text.secondary">
//             Built with Material UI + Recharts · Demo layout for Next.js/React
//           </Typography>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }
