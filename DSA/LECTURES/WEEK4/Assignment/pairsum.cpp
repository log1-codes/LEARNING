#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;

    while (t--) {
        int n;
        cin >> n;

        vector<int> arr(n);
        for (int i = 0; i < n; i++) {
            cin >> arr[i];
        }

        long long X;
        cin >> X;

        unordered_map<long long, long long> freq;
        long long count = 0;

        for (int i = 0; i < n; i++) {
            long long need = X - arr[i];

            if (freq.count(need)) {
                count += freq[need];
            }

            freq[arr[i]]++;
        }

        cout << count << "\n";
    }
}
