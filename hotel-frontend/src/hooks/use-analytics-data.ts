import { useEffect, useState } from "react";
import { getDashboardData, getRevenueData, getBookingsData, getCustomersData, getChurnData, getReportsData, getDataQualityData } from "@/services/analyticsApi";

export function useDashboardData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getDashboardData()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch(() => {
        if (mounted) setError("Unable to load dashboard data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useRevenueData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getRevenueData()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch(() => {
        if (mounted) setError("Unable to load revenue data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useBookingsData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getBookingsData()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch(() => {
        if (mounted) setError("Unable to load booking data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useCustomersData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getCustomersData()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch(() => {
        if (mounted) setError("Unable to load customer data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useChurnData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getChurnData()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch(() => {
        if (mounted) setError("Unable to load churn data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useReportsData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getReportsData()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch(() => {
        if (mounted) setError("Unable to load reports data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

export function useDataQualityData() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getDataQualityData()
      .then((result) => {
        if (mounted) setData(result);
      })
      .catch(() => {
        if (mounted) setError("Unable to load data quality data.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}
