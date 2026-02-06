#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;

    while (t--) {
        int n;
        cin >> n;

        vector<long long> arr(n);
        for (int i = 0; i < n; i++) {
            cin >> arr[i];
        }

        long long X;
        cin >> X;

        sort(arr.begin(), arr.end());
        long long count = 0;

        for (int i = 0; i < n - 2; i++) {
            int l = i + 1;
            int r = n - 1;

            while (l < r) {
                long long sum = arr[i] + arr[l] + arr[r];

                if (sum == X) {
                    if (arr[l] == arr[r]) {
                        long long len = r - l + 1;
                        count += (len * (len - 1)) / 2;
                        break;
                    }

                    long long cntL = 1, cntR = 1;

                    while (l + 1 < r && arr[l] == arr[l + 1]) {
                        cntL++;
                        l++;
                    }
                    while (r - 1 > l && arr[r] == arr[r - 1]) {
                        cntR++;
                        r--;
                    }

                    count += cntL * cntR;
                    l++;
                    r--;
                }
                else if (sum < X) {
                    l++;
                }
                else {
                    r--;
                }
            }
        }

        cout << count << "\n";
    }
}
