#include <iostream>
#include <algorithm>
using namespace std;

int main() {
    int a, b, c;
    cin >> a >> b >> c;

    int mn = min(a, min(b, c));
    int mx = max(a, max(b, c));

    cout << "Min = " << mn << endl;
    cout << "Max = " << mx << endl;

    return 0;
}
