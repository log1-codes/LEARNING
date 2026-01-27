#include <iostream>
using namespace std;

int main() {
    long long x;
    int n;
    cin >> x >> n;

    long long result = 1;

    for (int i = 0; i < n; i++) {
        result *= x;
    }

    cout << result;
    return 0;
}
